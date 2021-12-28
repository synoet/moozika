import React, { useEffect } from "react"

import SpotifyConfig from "../../spotify.config";

const SpotifyLogin = () => {

  const handleLogin = () => {
    window.location = SpotifyConfig.loginUrl;
  };

  useEffect(()=>{
    handleLogin();
  })

  return(
    <></>
  );

};

export default SpotifyLogin;
