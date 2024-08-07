import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useShowToast from './useShowToast'

const apiBaseUrl = 'https://new-thread-proj.onrender.com'
// const apiBaseUrl = 'http://localhost:5000'


const useGetUserProfile = () => {
    const[user,setUser]=useState(null)
    const[loading,setLoading]=useState(true)
    const {username}=useParams()
    const showToast=useShowToast()
    useEffect(()=>{
        const getUser=async()=>{
            try{
              const res=await fetch(`${apiBaseUrl}/api/users/profile/${username}`);
              const data=await res.json();
               if(data.error){
                showToast("Error",data.error,"error");
                return;
              }
              if(data.isFrozen){
                setUser(null);
                return;
              }
              setUser(data);
               }catch(error){
                  showToast("Error",error.message,"error");
                }finally{
                  setLoading(false);
                }
               }
               getUser()
    },[username,showToast])

  return  {loading,user}
}

export default useGetUserProfile
