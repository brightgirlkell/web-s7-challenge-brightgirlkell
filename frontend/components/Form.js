import axios from "axios";
import React, { useEffect, useState } from "react";
import * as yup from 'yup';

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
 fullNameTooShort: "full name must be at least 3 characters",
 fullNameTooLong: "full name must be at most 20 characters",
 sizeIncorrect: "size must be S or M or L",
};

// 👇 Here you will create your schema.
const formSchema = yup.object().shape({
 fullName: yup.string()
 .required()
 .min(3, validationErrors.fullNameTooShort)
 .max(20, validationErrors.fullNameTooLong),
 size: yup.string()
 .required()
 .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect)
});


// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
 { topping_id: "1", text: "Pepperoni" },
 { topping_id: "2", text: "Green Peppers" },
 { topping_id: "3", text: "Pineapple" },
 { topping_id: "4", text: "Mushrooms" },
 { topping_id: "5", text: "Ham" },
];

const initialFormValues = {
 fullName: "",
 size: "",
 toppings: [],
};

const initialErrorValues = {
 fullName: '',
 size: ''
}

export default function Form() {
 const [formValues, setFormValues] = useState(initialFormValues);
 const [message, setMessage] = useState('');
 const [isDisabled, setIsDisabled] = useState(true);
 const [errors, setErrors] = useState(initialErrorValues);

 useEffect(() => {
 formSchema.isValid(formValues).then((valid) => {
 setIsDisabled(!valid)
 })
 }, [formValues])

 const handleTextChange = (e) => {
 const { id, value } = e.target;
 setFormValues({ ...formValues, [id]: value });
 yup.reach(formSchema, id).validate(value.trim())
 .then(() => setErrors({...errors, [id]: ''}))
 .catch((e) => setErrors({...errors, [id]: e.errors[0]}))
 };

 const handleCheckboxChange = (e) => {
 const { id, checked } = e.target;
 if (checked) {
 const toppings = [...formValues.toppings, id];
 setFormValues({...formValues, toppings: toppings});
 } else {
 const toppings = formValues.toppings.filter(item => item !== id);
 setFormValues({...formValues, toppings: toppings});
 }
 }

 const handleSubmit = async (e) => {
 e.preventDefault();
 const response = await axios.post('http://localhost:9009/api/order', formValues);
 setMessage(response.data.message);
 setFormValues(initialFormValues);
 }

 return (
 <form onSubmit={handleSubmit}>
 <h2>Order Your Pizza</h2>
 {message && <div className="success">{message}</div>}

 <div className="input-group">
 <div>
 <label htmlFor="fullName">Full Name</label>
 <br />
 <input
 onChange={handleTextChange}
 value={formValues.fullName}
 placeholder="Type full name"
 id="fullName"
 type="text"
 />
 </div>
 {errors.fullName && <div className="error">{errors.fullName}</div>}
 </div>

 <div className="input-group">
 <div>
 <label htmlFor="size">Size</label>
 <br />
 <select onChange={handleTextChange} value={formValues.size} id="size">
 <option value="">----Choose Size----</option>
 <option value="S">Small</option>
 <option value="M">Medium</option>
 <option value="L">Large</option>
 {/* Fill out the missing options */}
 </select>
 </div>
 {errors.size && <div className="error">{errors.size}</div>}
 </div>

 <div className="input-group">
 {/* 👇 Maybe you could generate the checkboxes dynamically */}
 {toppings.map((topping) => (
 <label key={topping.topping_id}>
 <input onChange={handleCheckboxChange} checked={formValues.toppings.includes(topping.topping_id)} id={topping.topping_id} type="checkbox" />
 {topping.text}
 <br />
 </label>
 ))}
 </div>
 {/* 👇 Make sure the submit stays disabled until the form validates! */}
 <input disabled={isDisabled} type="submit" />
 </form>
 );
}