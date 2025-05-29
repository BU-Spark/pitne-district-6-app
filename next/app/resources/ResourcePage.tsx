import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import ResourceCard from '../components/ResourceCard/ResourceCard';

import { Heart } from 'lucide-react';

export default function ResourcePage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-start" style={{ paddingTop: '80px' }}>
        <ResourceCard
          icon={<Heart size={20} />}
          category="Healthcare"
          title="Boston Health Center"
          location="123 Main St, Boston, MA"
          email="contact@bostonhealth.org"
          contact="(617) 555-1234"
        />
      </div>
    </>
  );
}
