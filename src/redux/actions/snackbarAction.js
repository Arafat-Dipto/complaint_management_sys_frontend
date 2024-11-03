export const openSnackbar = (message, status) => ({
  type: "OPEN_SNACKBAR",
  payload: { message, status },
});

export const closeSnackbar = () => ({
  type: "CLOSE_SNACKBAR",
});
export const toggleSnackbar = () => ({
  type: "TOGGLE_SNACKBAR",
});
