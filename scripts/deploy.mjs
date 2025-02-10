import dotenv from "dotenv";
import util from "node:util";
import { exec } from "node:child_process";

dotenv.config();

const execAsync = util.promisify(exec);

async function deployToCloudRun() {
  try {
    const projectId = process.env.GOOGLE_APPLICATION_ID;
    const region = process.env.GOOGLE_APPLICATION_LOCATION;
    const serviceName = process.env.GOOGLE_APPLICATION_SERVICE_NAME;
    const imageUrl = `gcr.io/${projectId}/${serviceName}`;
    const serviceAccount = process.env.GOOGLE_APPLICATION_SERVICE_ACCOUNT;

    // Build and push the container
    console.log("Building container...");
    const buildCommand = `gcloud builds submit --tag ${imageUrl}`;

    console.log("Executing:", buildCommand);
    const { stdout: buildOutput } = await execAsync(buildCommand);
    console.log("Build output:", buildOutput);

    // Deploy to Cloud Run with explicit environment configuration
    console.log("Deploying to Cloud Run...");
    const deployCommand = `gcloud run deploy ${serviceName} \
      --image=${imageUrl} \
      --platform=managed \
      --region=${region} \
      --service-account=${serviceAccount} \
      --set-secrets=GEMINI_API_KEY=GEMINI_API_KEY:latest \
      --set-secrets=GOOGLE_CLIENT_ID=GOOGLE_CLIENT_ID:latest \
      --set-secrets=GOOGLE_CLIENT_SECRET=GOOGLE_CLIENT_SECRET:latest \
      --set-env-vars=GOOGLE_APPLICATION_ID=${projectId},GOOGLE_APPLICATION_LOCATION=${region},NEXTAUTH_SECRET=${process.env.NEXTAUTH_SECRET},NODE_ENV=production,GOOGLE_APPLICATION_CREDENTIALS="" \
      --memory=2Gi \
      --min-instances=1 \
      --max-instances=1 \
      --allow-unauthenticated \
      --project=${projectId}`;

    console.log("Executing deploy command...");
    const { stdout: deployOutput } = await execAsync(deployCommand);
    console.log("Deploy output:", deployOutput);

    // Get the deployed URL
    const { stdout: url } = await execAsync(
      `gcloud run services describe ${serviceName} --platform=managed --region=${region} --format="get(status.url)" --project=${projectId}`,
    );

    // Update NEXTAUTH_URL
    console.log("Setting NEXTAUTH_URL to:", url.trim());
    await execAsync(`
            gcloud run services update ${serviceName} \
            --platform=managed \
            --region=${region} \
            --set-env-vars=NEXTAUTH_URL=${url.trim()} \
            --set-env-vars=GOOGLE_APPLICATION_CREDENTIALS= \
            --project=${projectId}
        `);
    // なぜか、ここで `--set-env-vars=GOOGLE_APPLICATION_CREDENTIALS=` を入れないと、正しく動作しない。deploy時に設定してるはずなのに？？？？

    console.log("Deployment completed successfully");
    console.log("Application URL:", url.trim());
  } catch (error) {
    console.error("Deployment failed:", error);
    if (error.stdout) console.log("Command output:", error.stdout);
    if (error.stderr) console.log("Command error output:", error.stderr);
    process.exit(1);
  }
}

deployToCloudRun();
