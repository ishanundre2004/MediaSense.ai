// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Video,
//   History,
//   Database,
//   LogOut,
// } from "lucide-react";

// interface LayoutProps {
//   children: React.ReactNode;
// }

// export default function Layout({ children }: LayoutProps) {
//   const location = useLocation();

//   const isActive = (path: string) => location.pathname === path;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
//       <nav className="fixed top-4 left-4 h-[calc(100vh-2rem)] w-64 bg-black/30 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-xl shadow-black/40 transform transition-transform duration-300">
//         <div className="p-6">
//           <h1 className="text-2xl font-bold text-white">VideoSense AI</h1>
//         </div>
//         <ul className="mt-6 space-y-2 px-4">
//           <li>
//             <Link
//               to="/dashboard"
//               className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
//                 isActive("/dashboard")
//                   ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
//                   : "text-gray-400 hover:bg-gray-800 hover:text-white"
//               }`}
//             >
//               <LayoutDashboard size={20} />
//               <span>Dashboard</span>
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/analyze"
//               className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
//                 isActive("/analyze")
//                   ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
//                   : "text-gray-400 hover:bg-gray-800 hover:text-white"
//               }`}
//             >
//               <Video size={20} />
//               <span>Analyze Video</span>
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/history"
//               className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
//                 isActive("/history")
//                   ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
//                   : "text-gray-400 hover:bg-gray-800 hover:text-white"
//               }`}
//             >
//               <History size={20} />
//               <span>History</span>
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/products"
//               className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
//                 isActive("/products")
//                   ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
//                   : "text-gray-400 hover:bg-gray-800 hover:text-white"
//               }`}
//             >
//               <Database size={20} />
//               <span>Products</span>
//             </Link>
//           </li>
//         </ul>
//         <div className="absolute bottom-4 left-4 right-4">
//           <button className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-200 transform hover:scale-105">
//             <LogOut size={20} />
//             <span>Logout</span>
//           </button>
//         </div>
//       </nav>
//       <main className="ml-64 p-8 animate-fadeIn">{children}</main>
//     </div>
//   );
// }




import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Video,
  History,
  Database,
  MessageSquare,
  LogOut,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <nav className="fixed top-4 left-4 h-[calc(100vh-2rem)] w-64 bg-black/30 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-xl shadow-black/40 transform transition-transform duration-300">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white">VideoSense AI</h1>
        </div>
        <ul className="mt-6 space-y-2 px-4">
          <li>
            <Link
              to="/dashboard"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                isActive("/dashboard")
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/analyze"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                isActive("/analyze")
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Video size={20} />
              <span>Analyze Video</span>
            </Link>
          </li>
          <li>
            <Link
              to="/comments"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                isActive("/comments")
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <MessageSquare size={20} />
              <span>Analyze Comments</span>
            </Link>
          </li>
          <li>
            <Link
              to="/history"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                isActive("/history")
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <History size={20} />
              <span>History</span>
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                isActive("/products")
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Database size={20} />
              <span>Products</span>
            </Link>
          </li>
        </ul>
        <div className="absolute bottom-4 left-4 right-4">
          <button className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-200 transform hover:scale-105">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
      <main className="ml-64 p-8 animate-fadeIn">{children}</main>
    </div>
  );
}