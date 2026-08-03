import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: ReactNode;
  chats?: Array<{ id: string; title: string; created_at: string }>;
  onNewChat?: () => void;
  onDeleteChat?: (id: string) => void;
  currentChatId?: string;
}

export function MainLayout({ children, chats = [], onNewChat, onDeleteChat, currentChatId }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-luxury-black">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gold-500/3 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gold-500/2 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-grid opacity-10" />
      </div>

      <Sidebar
        chats={chats}
        onNewChat={onNewChat || (() => {})}
        onDeleteChat={onDeleteChat || (() => {})}
        currentChatId={currentChatId}
      />
      <div className="lg:ml-72 relative">
        <Header />
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
