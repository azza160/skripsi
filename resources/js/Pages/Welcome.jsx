import React from 'react';
import AppLayout from '../Layouts/AppLayout';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

export default function Welcome() {
    return (
        <AppLayout>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-card p-6 rounded-lg shadow-lg"
            >
                <motion.h1 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold mb-4 text-card-foreground"
                >
                    Welcome to Laravel React
                </motion.h1>
                
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-muted-foreground mb-6"
                >
                    This is a sample page using Laravel, React, Inertia.js, and shadcn/ui.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-4"
                >
                    <Button variant="default">Get Started</Button>
                    <Button variant="outline">Learn More</Button>
                </motion.div>
            </motion.div>
        </AppLayout>
    );
} 