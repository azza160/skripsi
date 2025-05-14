import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { useForm } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Swal from 'sweetalert2';


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

export default function Login() {
  const { props } = usePage();
  const flash = props.flash;
  const [showPassword, setShowPassword] = React.useState(false);
  
  const {data, setData, post, processing, errors} = useForm({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (flash?.message) {
      Swal.fire({
        icon: flash.success ? 'success' : 'error',
        title: flash.success ? 'Sukses' : 'Gagal',
        text: flash.message,
        confirmButtonText: 'OK',
        confirmButtonColor: '#6366f1', // warna tombol (optional)
      });
    }
  }, [flash]);

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('login'));
  } 

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
              <CardTitle className="text-2xl text-center">Masuk ke Kotoba</CardTitle>
              <CardDescription className="text-center">
                Selamat datang kembali! Lanjutkan petualanganmu dalam belajar Bahasa Jepang.
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="password"
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

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-5"
                  disabled={processing}
                >
                  {processing ? 'Masuk...' : 'Masuk'}
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
                  className="w-full  font-medium py-5"
                  onClick={() => window.location.href = route('google.login')}
                >
                   <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2"></img>
                  Masuk dengan Google
                </Button>
              </motion.div>
            </motion.form>
          </CardContent>
          <CardFooter>
            <motion.p 
              variants={itemVariants}
              className="text-center text-sm text-muted-foreground w-full"
            >
              Belum punya akun?{' '}
              <a href={route('register')} className="font-medium text-primary hover:underline">
                Daftar sekarang
              </a>
            </motion.p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
} 