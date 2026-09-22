export const useFormValidation = (form) => {
  const [errors, setErrors] = useState({});

  const validate = (values) => {
    let temp = {};
    if (!values.name) {
      temp.name = "Name is required";
    }
    if (!values.email) {
      temp.email = "Email is required";
    }
    if (!values.password) {
      temp.password = "Password is required";
    }
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };
};
