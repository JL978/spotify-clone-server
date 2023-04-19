import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useId = (page) => {
  const [id, setId] = useState(null);
  const location = useLocation();
  
  useEffect(() => {
    const path = location.pathname.split('/');
    const pathLength = path.length;
    
    setId(pathLength === 3 ? path[pathLength - 1] : path.find((p) => p === page) + 1 || '');
  }, [location, page]);
  
  return id;
};

export default useId;