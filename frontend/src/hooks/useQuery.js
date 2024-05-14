import { useEffect, useState } from 'react';
import axiosClient from '../config/axios';

const useQuery = (url, refetch) => {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    error: '',
  });

  useEffect(() => {
    const fetch = async () => {
      axiosClient
        .get(url)
        .then(({ data }) => setState({ data, isLoading: false, error: '' }))
        .catch(error =>
          setState({ data: null, isLoading: false, error: error.message })
        );
    };

    fetch();
  }, [url, refetch]);

  return state;
};

export default useQuery;

// import { useEffect, useState } from 'react';
// import axios from 'axios';

// // Custom hook to fetch data from a given URL
// const useQuery = (url, refetch) => {
//   const [state, setState] = useState({
//     data: null, // Holds the fetched data
//     isLoading: true, // Indicates if data is still loading
//     error: '', // Holds error messages if any
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(url); // Fetch data from the provided URL
//         setState({ data: response.data, isLoading: false, error: '' }); // Update state with fetched data
//       } catch (error) {
//         setState({ data: null, isLoading: false, error: error.message }); // Handle errors
//       }
//     };

//     fetchData(); // Call the fetch function
//   }, [url, refetch]); // Run effect when URL or refetch changes

//   return state; // Return the current state
// };

// export default useQuery;
