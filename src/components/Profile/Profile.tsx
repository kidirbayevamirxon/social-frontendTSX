import { Button } from "../ui/button";
import leftStrelka from "/arrow-left-solid.svg";
function Profile() {
  return (
    <>
      <div className="bg-black w-full h-screen overflow-hidden">
        <Button className="w-[90px] h-20 ml-[15%] mt-14">
          <img src={leftStrelka} alt="" className="w-xl h-15" />
        </Button>
      </div>
    </>
  );
}

export default Profile;
