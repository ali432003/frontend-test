import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Tooltip,
  Button,
} from "@material-tailwind/react";

const Profile = () => {
  const [profData, setProfData] = useState({}); // Initializing state with an empty object
  const [updUser, setUpdUser] = useState({});
  const [Load, setLoad] = useState(false);
  const [Img, setImg] = useState("");
  const { userId } = useParams(); // Assuming you have this to get the userId from URL params

  useEffect(() => {
    const user = localStorage.getItem("chatapp");
    if (user) {
      const parseduser = JSON.parse(user);
      setProfData(parseduser); // Update state when component mounts
    }
  }, []);

  const updateImage = async () => {
    setLoad(true);
    try {
      const formData = new FormData();
      formData.append("userImg", Img); // 'image' should match the field name expected by your backend

      const res = await axios.put(
        `/api/user/imageupload/${profData._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.status) {
        setUpdUser(res.data.data); // Assuming res.data.data contains updated user info
        setLoad(false);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
    setLoad(false);
  };

  const profileBoy =
    updUser?.profilepic ||
    profData.profilepic ||
    `https://avatar.iran.liara.run/public/boy?username=${profData.username}`;
  const profileGirl =
    updUser.profilepic ||
    profData.profilepic ||
    `https://avatar.iran.liara.run/public/girl?username=${profData.username}`;
  return (
    <Card className="w-96">
      <CardHeader floated={false} className="h-80">
        <img
          src={profData.gender === "male" ? profileBoy : profileGirl}
          alt="profile-picture"
        />
      </CardHeader>
      <CardBody className="text-center">
        <Typography variant="h4" color="blue-gray" className="mb-2">
          {profData.fullname}
        </Typography>
        <Typography color="blue-gray" className="font-medium" textGradient>
          <strong>username :</strong> {profData.username}
        </Typography>
        <Typography color="blue-gray" className="font-medium" textGradient>
          <strong>email :</strong> {profData.email}
        </Typography>
        <input
          type="file"
          disabled={Load ? true : false}
          onChange={(e) => {
            setImg(e.target.files[0]);
          }}
        />
        <Button
          onClick={updateImage}
          disabled={!Img || Load ? true : false}
          className="mt-2"
        >
          {Load ? "uploading.." : "edit img"}
        </Button>
      </CardBody>
      <CardFooter className="flex justify-center gap-7 pt-2">
        <Tooltip content="Like">
          <Typography
            as="a"
            href="#facebook"
            variant="lead"
            color="blue"
            textGradient
          >
            <i className="fab fa-facebook" />
          </Typography>
        </Tooltip>
        <Tooltip content="Follow">
          <Typography
            as="a"
            href="#twitter"
            variant="lead"
            color="light-blue"
            textGradient
          >
            <i className="fab fa-twitter" />
          </Typography>
        </Tooltip>
        <Tooltip content="Follow">
          <Typography
            as="a"
            href="#instagram"
            variant="lead"
            color="purple"
            textGradient
          >
            <i className="fab fa-instagram" />
          </Typography>
        </Tooltip>
      </CardFooter>
    </Card>
  );
};

export default Profile;
