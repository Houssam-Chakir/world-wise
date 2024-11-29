import { useNavigate } from "react-router-dom";
import Button from "./Button";


function BackButton() {
  const navigateTo = useNavigate();

  return (
    <Button
      type={"back"}
      onClick={(e) => {
        e.preventDefault();
        navigateTo(-1);
      }}
    >
      &larr; Back
    </Button>
  );
}

export default BackButton;
