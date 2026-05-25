import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Lock, ArrowLeft, Eye } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface SuperAdminGuardProps {
  children: React.ReactNode;
}

// Demo mode - allows preview without superadmin login
const DEMO_MODE = true;

export default function SuperAdminGuard({ children }: SuperAdminGuardProps) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [showDemoBanner, setShowDemoBanner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated && !DEMO_MODE) {
        navigate('/login', { replace: true });
      } else if (isAuthenticated && user?.role !== 'superadmin' && !DEMO_MODE) {
        setIsChecking(false);
      } else {
        setIsChecking(false);
        if (DEMO_MODE && (!isAuthenticated || user?.role !== 'superadmin')) {
          setShowDemoBanner(true);
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, navigate]);

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-deep-brown">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-10 w-10 rounded-full border-4 border-gold border-t-transparent"
        />
      </div>
    );
  }

  // Not authenticated - in demo mode show login prompt but don't redirect
  if (!isAuthenticated && !DEMO_MODE) {
    return (
      <div className="flex h-screen items-center justify-center bg-deep-brown">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
            <Lock size={28} className="text-gold" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-white">需要登录</h2>
          <p className="mb-6 text-sm text-white/50">请先登录超级管理员账户</p>
          <button onClick={() => navigate('/login')} className="rounded-lg bg-gold px-6 py-2.5 text-sm font-semibold text-deep-brown hover:bg-gold-dark">
            前往登录
          </button>
        </motion.div>
      </div>
    );
  }

  // Authenticated but not superadmin - in demo mode allow access with banner
  if (user?.role !== 'superadmin' && !DEMO_MODE) {
    return (
      <div className="flex h-screen items-center justify-center bg-deep-brown px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-coral/20">
            <ShieldAlert size={36} className="text-coral" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-white">403</h1>
          <h2 className="mb-3 text-xl font-semibold text-white/90">访问被拒绝</h2>
          <p className="mb-6 text-xs text-white/30">当前角色: <span className="text-gold">{user?.role || '未知'}</span> | 需要: <span className="text-gold">superadmin</span></p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 rounded-lg border border-white/10 px-5 py-2.5 text-sm text-white/70 hover:bg-white/5"><ArrowLeft size={16} />返回首页</button>
            <button onClick={() => navigate('/admin')} className="rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-deep-brown hover:bg-gold-dark">普通管理后台</button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Demo mode - render children with demo banner
  return (
    <>
      {children}
      <AnimatePresence>
        {showDemoBanner && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 z-[200] bg-gold/95 text-deep-brown text-center py-2 px-4 text-sm font-medium flex items-center justify-center gap-2"
          >
            <Eye size={16} />
            <span>演示模式 - 部分操作受限 | 正式环境需superadmin权限</span>
            <button onClick={() => setShowDemoBanner(false)} className="ml-4 text-xs underline hover:no-underline">隐藏</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
