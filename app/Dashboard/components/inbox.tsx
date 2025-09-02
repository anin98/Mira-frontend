// // components/Inbox.tsx
// import React from 'react';
// import { MessageSquare, Clock, User } from 'lucide-react';
// import { Conversation } from './api';

// interface InboxProps {
//   conversations: Conversation[];
//   loading: boolean;
//   onConversationClick?: (conversationId: string) => void;
// }

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case 'pending':
//       return 'bg-yellow-100 text-yellow-800';
//     case 'resolved':
//       return 'bg-green-100 text-green-800';
//     case 'active':
//       return 'bg-blue-100 text-blue-800';
//     default:
//       return 'bg-gray-100 text-gray-800';
//   }
// };

// export const Inbox: React.FC<InboxProps> = ({ conversations, loading, onConversationClick }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-sm border">
//       <div className="p-6 border-b">
//         <div className="flex items-center justify-between">
//           <h3 className="text-lg font-semibold text-gray-900">Customer Inbox</h3>
//           <div className="flex items-center space-x-2">
//             <MessageSquare className="w-5 h-5 text-gray-400" />
//             <span className="text-sm text-gray-500">
//               {conversations.filter(c => c.status === 'pending').length} pending
//             </span>
//           </div>
//         </div>
//       </div>
//       <div className="p-6">
//         {loading ? (
//           <div className="space-y-3">
//             {[...Array(3)].map((_, i) => (
//               <div key={i} className="animate-pulse">
//                 <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//                 <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//               </div>
//             ))}
//           </div>
//         ) : conversations.length > 0 ? (
//           <div className="space-y-4">
//             {conversations.slice(0, 10).map((conversation) => (
//               <div 
//                 key={conversation.id} 
//                 className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
//                 onClick={() => onConversationClick?.(conversation.id)}
//               >
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2 mb-1">
//                     <User className="w-4 h-4 text-gray-400" />
//                     <p className="font-medium text-gray-900">
//                       {conversation.customer_name || 'Anonymous Customer'}
//                     </p>
//                     <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(conversation.status)}`}>
//                       {conversation.status}
//                     </span>
//                     {conversation.unread_count && conversation.unread_count > 0 && (
//                       <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
//                         {conversation.unread_count}
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-sm text-gray-600 truncate">
//                     {conversation.last_message || 'No messages yet'}
//                   </p>
//                   <div className="flex items-center gap-1 mt-1">
//                     <Clock className="w-3 h-3 text-gray-400" />
//                     <p className="text-xs text-gray-500">
//                       {new Date(conversation.timestamp).toLocaleDateString()} at {new Date(conversation.timestamp).toLocaleTimeString()}
//                     </p>
//                   </div>
//                 </div>
//                 <MessageSquare className="w-5 h-5 text-gray-400 ml-4" />
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500 text-center py-8">No conversations yet</p>
//         )}
//       </div>
//     </div>
//   );
// };