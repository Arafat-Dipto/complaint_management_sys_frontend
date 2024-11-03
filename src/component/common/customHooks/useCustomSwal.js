import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MyReactSwal = withReactContent(Swal);

const useCustomSwal = () => {
  return MyReactSwal;
};

export default useCustomSwal;
