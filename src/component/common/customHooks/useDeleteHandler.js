import useCustomSwal from "./useCustomSwal";

const useDeleteHandler = (deleteEntity, refreshList) => {
  const MySwal = useCustomSwal();
  return (entity, slug) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      customClass: {
        confirmButton: "swal2-confirm-btn-color",
        cancelButton: "swal2-cancel-btn-color",
      },
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteEntity("", entity?.id, slug);
          if (res?.success) {
            MySwal.fire({
              title: "Deleted!",
              text: res?.message,
              icon: "success",
            });
            refreshList();
          }
        } catch (error) {
          console.error(error);
          MySwal.fire({
            icon: "error",
            title: "Oops...",
            text: error?.data?.errors && error?.data.errors[0],
          });
        }
      }
    });
  };
};
export default useDeleteHandler;
