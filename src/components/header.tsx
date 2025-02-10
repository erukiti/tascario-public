import type React from "react";
import { Plus, Bell, Settings, LogOut } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/parts/dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/parts/avatar";
import type { Session } from "next-auth";

type Props = {
  sessionData: Session | null;
};

export const TascarioHeader: React.FC<Props> = ({ sessionData }) => {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tascario
            </h1>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {sessionData ? (
              <>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
                  onClick={() => {
                    window.location.href = "/entry/new";
                  }}
                >
                  <Plus size={18} />
                  <span>New Entry</span>
                </button>

                {/* <button className="p-2 rounded-full hover:bg-gray-100 relative">
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
                </button> */}

                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <div className="flex items-center space-x-3 p-2 rounded-full hover:bg-gray-100">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={sessionData.user.image ?? ""} />
                        <AvatarFallback>
                          {sessionData.user.name?.charAt(0) ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">
                          {sessionData.user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {sessionData.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      disabled
                      className="opacity-50 cursor-not-allowed"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings (Coming Soon)</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => void signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-all shadow-sm hover:shadow-md"
                onClick={() => void signIn()}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
