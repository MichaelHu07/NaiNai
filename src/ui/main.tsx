import React from 'react';
import { createRoot } from 'react-dom/client';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import './styles.css';
import App from './App';

createRoot(document.getElementById('root')!).render(<React.StrictMode><Theme accentColor="tomato" grayColor="sand" radius="medium" scaling="100%"><App /></Theme></React.StrictMode>);
