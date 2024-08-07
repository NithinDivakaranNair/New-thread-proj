
import { AddIcon } from "@chakra-ui/icons";
import { Button,
         CloseButton,
         Flex,
         FormControl,
         Image,
         Input,
         Modal,
         ModalBody,
         ModalCloseButton,
         ModalContent,
         ModalFooter,
         ModalHeader,
         ModalOverlay
         ,Text,Textarea,useColorModeValue
         , useDisclosure, 
         } from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";


const MAX_CHAR=500;

const CreatePost = () => {
  const { isOpen,onOpen, onClose } = useDisclosure()
  const[postText,setPostText]=useState("")
  const {handleImageChange,imgUrl,setImgUrl}=usePreviewImg();
  const imageRef=useRef(null)
  const[remainigChar,setRemainingChar]=useState(MAX_CHAR)
	const user = useRecoilValue(userAtom);
  const ShowToast=useShowToast()
  const[loading,setLoading]=useState(false)
  const [posts,setPosts]=useRecoilState(postsAtom)
  const {username}=useParams();


  const storedUser = JSON.parse(localStorage.getItem('user-threads'));
  const token = storedUser ? storedUser.Gt : null;

    const apiBaseUrl = 'https://new-thread-proj.onrender.com'
    // const apiBaseUrl = 'http://localhost:5000'


const handleTextChange=(e)=>{
    const inputText=e.target.value;
   

   if(inputText.length>MAX_CHAR){
    const truncatedText=inputText.slice(0,MAX_CHAR);
    setPostText(truncatedText);
    setRemainingChar(0)
   }else{
    setPostText(inputText);
    setRemainingChar(MAX_CHAR-inputText.length);
   }
  };

   const handleCreatePost=async()=>{
    try{
      setLoading(true)
    const res=await fetch(`${apiBaseUrl}/api/posts/create`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        'Authorization': `Bearer ${token}`

      },
      body:JSON.stringify({postedBy:user._id,text:postText,img:imgUrl})
    })
    const data=await res.json()
      if(data.error){
        ShowToast("Error",data.error,"error")
        return
      }
    ShowToast("Sucess","Post created successfully","success");
       if(username===user.username){
        setPosts([data,...posts])
       }

    onClose()
    setImgUrl("");
    setPostText("")
    }catch(error){
      ShowToast("Error",error,"error")
    }finally{
      setLoading(false)
    }
   }

   
   

 return (
    <>
    <Button
    position={"fixed"}
    bottom={10}
    right={5}
    bg={useColorModeValue("gray.300","gray.dark")}
    onClick={onOpen}
    size={{ base: "sm", sm: "md" }}
    >
      <AddIcon/>
    </Button>


    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody pb={6}>
            <FormControl>

              <Textarea
              placeholder="Post content goes here.."
              onChange={handleTextChange}
              value={postText}  
              />

              <Text fontSize='xs' fontWeight='bold'
               textAlign={'right'} m={'1'}  color={'gray.800'}>
                {remainigChar}/{MAX_CHAR}
              </Text>

         <Input type="file" hidden ref={imageRef} onChange={handleImageChange}/>
          <BsFillImageFill 
          style={{marginLeft:"5px",cursor:"pointer"}}
          size={16} onClick={()=>imageRef.current.click()}
          />

            </FormControl>

            {imgUrl && (
            <Flex mt={5} w={"full"} position={"relative"}>
              <Image src={imgUrl} alt="Selected img" />
              <CloseButton onClick={()=>{setImgUrl('')}}
               bg={"gray.800"} position={"absolute"} top={2} right={2}/>
            </Flex>
            )
            }
                </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleCreatePost}
            isLoading={loading}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreatePost
