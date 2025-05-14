import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { useForm } from '@inertiajs/react';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

export default function Register() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const { data, setData, post, processing, errors } = useForm({
    nama_pengguna: '',
    nama_lengkap: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('register'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="space-y-1">
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl text-center">Daftar ke Kotoba</CardTitle>
              <CardDescription className="text-center">
                Yuk gabung dan mulai petualanganmu mempelajari kosakata Bahasa Jepang dengan cara yang seru dan penuh tantangan!
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.form onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={itemVariants}>
                <Input
                  type="text"
                  placeholder="Nama Pengguna"
                  icon={User}
                  value={data.nama_pengguna}
                  onChange={e => setData('nama_pengguna', e.target.value)}
                  error={errors.nama_pengguna}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Input
                  type="text"
                  placeholder="Nama Lengkap"
                  icon={User}
                  value={data.nama_lengkap}
                  onChange={e => setData('nama_lengkap', e.target.value)}
                  error={errors.nama_lengkap}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Input
                  type="email"
                  placeholder="Email"
                  icon={Mail}
                  value={data.email}
                  onChange={e => setData('email', e.target.value)}
                  error={errors.email}
                />
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  icon={Lock}
                  value={data.password}
                  onChange={e => setData('password', e.target.value)}
                  error={errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Password Confirmation"
                  icon={Lock}
                  value={data.password_confirmation}
                  onChange={e => setData('password_confirmation', e.target.value)}
                  error={errors.password_confirmation}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={processing}
                >
                  {processing ? 'Mendaftar...' : 'Buat Akun'}
                </Button>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">atau</span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => window.location.href = route('google.login')}
                >
                   <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2"></img>
                  Daftar dengan Google
                </Button>
              </motion.div>
            </motion.form>
          </CardContent>
          <CardFooter>
            <motion.p 
              variants={itemVariants}
              className="text-center text-sm text-muted-foreground w-full"
            >
              Sudah punya akun?{' '}
              <a href={route('login')} className="font-medium text-primary hover:underline">
                Masuk sekarang
              </a>
            </motion.p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}