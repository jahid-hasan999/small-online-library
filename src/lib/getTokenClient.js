import React from 'react';
import { authClient } from './auth-client';

const getTokenClient =async() => {
   const { data} = await authClient.token();
      console.log('Token data:', data);
  const token = data?.token;
  return token;
}

export default getTokenClient;