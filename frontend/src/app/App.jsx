import React, { useState } from 'react';
import AppProviders from './providers';
import AppRouter from './router';
import MainLayout from '../layouts/MainLayout';

export const App = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <AppProviders>
      <MainLayout onAddProduct={() => setIsAddModalOpen(true)}>
        <AppRouter
          isAddModalOpen={isAddModalOpen}
          setIsAddModalOpen={setIsAddModalOpen}
        />
      </MainLayout>
    </AppProviders>
  );
};

export default App;
