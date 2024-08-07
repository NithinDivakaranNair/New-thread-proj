import { Box, Flex, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import SuggestedUser from './SuggestedUser'
import useShowToast from '../hooks/useShowToast'


const SuggestedUsers = () => {

    const[loading,setLoading]=useState(true);
    const[suggestedUsers,setSuggestedUsers]=useState([]);
    const showToast=useShowToast();


    
  const storedUser = JSON.parse(localStorage.getItem('user-threads'));
  const token = storedUser ? storedUser.Gt : null;




    // const apiBaseUrl = 'http://localhost:5000'
    const apiBaseUrl = 'https://new-thread-proj.onrender.com'


useEffect(()=>{
const getSuggestedUsers=async()=>{
  setLoading(true)
  try{  
    const res=await fetch(`${apiBaseUrl}/api/users/suggested`,{
      headers: {
       
        'Authorization': `Bearer ${token}`
       
      }
    });
    const data=await res.json();
    console.log("aaaaaa",data)
    if(data.error){
      showToast("Error",data.error,"error")
      return;
    }
setSuggestedUsers(data);
console.log("suggestedUsers",suggestedUsers)
  }catch(error){
    showToast("Error",data.error,"error");
  }finally{
    setLoading(false)
  }
}
getSuggestedUsers()
},[showToast])


  return (
    <>
      <Text mb={4} fontWeight={"bold"}>
        Suggested User
        </Text>  
        <Flex  direction={"column"} gap={4}>
   {!loading && suggestedUsers.map((user) => <SuggestedUser key={user._id} user={user}/>)}

         {loading && [0,1,2,3,4].map((_,idx)=>(
            <Flex key={idx} gap={2} alignItems={"center"} p={"1"} borderRadius={"md"}>

     {/* Avatar Skeleton */}
               <Box>
                <SkeletonCircle size={10} />
               </Box>

    {/* username and fullname  skeleton */}
               <Flex w={"full"} flexDirection={"column"} gap={2}>
                   <Skeleton h={"8px"} w={"80px"} />
                   <Skeleton h={"8px"} w={"90px"} />
               </Flex>

    {/* follow botton skeleton  */}
            <Flex>
                <Skeleton h={"20px"} w={"60px"}/>
            </Flex>
                </Flex>
         ))}
        </Flex>
    </>
  )
}

export default SuggestedUsers

//loading skeleton for suggested users,if u want to copy and pasted

  // <Flex key={idx} gap={2} alignItems={"center"} p={"1"} borderRadius={"md"}>

  //    {/* Avatar Skeleton */}
  //              <Box>
  //               <SkeletonCircle size={10} />
  //              </Box>

  //   {/* username and fullname  skeleton */}
  //              <Flex w={"full"} flexDirection={"column"} gap={2}>
  //                  <Skeleton h={"8px"} w={"80px"} />
  //                  <Skeleton h={"8px"} w={"90px"} />
  //              </Flex>

  //   {/* follow botton skeleton  */}
  //           <Flex>
  //               <Skeleton h={"20px"} w={"60px"}/>
  //           </Flex>
  //               </Flex>
  //        ))}