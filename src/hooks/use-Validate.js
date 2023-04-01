const useValidate = () => {

    const notEmpty = (value) => {
        return value.trim() !== "";
    }

    const positiveNumber = (value) => {
        return /^[0-9]+$/.test(value) && Number(value) > 0;
    }

    const positiveFloat = (value) => {
        if (isNaN(value)) {
            return false;
          }
          
          const num = parseFloat(value);
          
          if (isNaN(num)) {
            return false;
          }
          
          if (num <= 0) {
            return false;
          }
          
          return true;
    }

    const email = (value) => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(value)
    }

    const phone = (value) => {
        const pattern = /^\+(?:[0-9] ?){6,14}[0-9]$/;
        return pattern.test(value);
    }

    return {
        notEmpty: notEmpty,
        positiveNumber: positiveNumber,
        email: email,
        phone: phone,
        positiveFloat: positiveFloat
    };
}

export default useValidate;