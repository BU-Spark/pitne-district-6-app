import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import ResourceCard from '../components/ResourceCard/ResourceCard';
import Sidebar from '../components/Sidebar/Sidebar';

import { Heart } from 'lucide-react';

export default function ResourcePage() {
  return (
    <>
      <Navbar />
      <div className="main-container">
        <div className="map-container">
          <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-start" style={{ paddingTop: '80px' }}>
            <ResourceCard
              icon={<Heart size={20} />}
              category="Healthcare"
              title="Boston Health Center"
              email="contact@bostonhealth.org"
              contact="(617) 555-1234"
              website="https://bostonhealth.org"
              lat={42.3601}
              lng={-71.0589}
            />
          </div>
        </div>
        <Sidebar
          selectedCategories={new Set(['Healthcare'])} // or a state variable if needed
          setSelectedCategories={() => {}} // no-op function unless you plan to filter
        />
      </div>
    </>
  );
}
