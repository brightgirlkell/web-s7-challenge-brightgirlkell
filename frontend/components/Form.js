import React, { useState } from 'react';

const validationErrors = {
  fullNameTooShort: 'Full name must be at least 3 characters',
  fullNameTooLong: 'Full name must be at most 20 characters',
  sizeIncorrect: 'Size must be S or M or L'
};

const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
];

const Form = () => {
  const [fullName, setFullName] = useState('');
  const [size, setSize] = useState('');
  const [toppingSelection, setToppingSelection] = useState([]);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (fullName.length < 3) {
      errors.fullName = validationErrors.fullNameTooShort;
    } else if (fullName.length > 20) {
      errors.fullName = validationErrors.fullNameTooLong;
    }
    if (!['S', 'M', 'L'].includes(size)) {
      errors.size = validationErrors.sizeIncorrect;
    }
    if (toppingSelection.length === 0) {
      errors.toppings = 'Please select at least one topping';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log({ fullName, size, toppingSelection });
      // Handle form submission here
    }
  };

  const handleCheckboxChange = (toppingId) => {
    setToppingSelection((prevSelection) => {
      if (prevSelection.includes(toppingId)) {
        return prevSelection.filter((id) => id !== toppingId);
      } else {
        return [...prevSelection, toppingId];
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {/* Placeholder for success and failure messages */}
      {true && <div className='success'>Thank you for your order!</div>}
      {false && <div className='failure'>Something went wrong</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Type full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          {errors.fullName && <div className='error'>{errors.fullName}</div>}
        </div>
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select
            id="size"
            name="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            <option value="">----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
          {errors.size && <div className='error'>{errors.size}</div>}
        </div>
      </div>

      <div className="input-group">
        {toppings.map((topping) => (
          <label key={topping.topping_id}>
            <input
              name={`toppings.${topping.topping_id}`}
              type="checkbox"
              checked={toppingSelection.includes(topping.topping_id)}
              onChange={() => handleCheckboxChange(topping.topping_id)}
            />
            {topping.text}<br />
          </label>
        ))}
        {errors.toppings && <div className='error'>{errors.toppings}</div>}
      </div>

      <input type="submit" disabled={Object.keys(errors).length > 0} />
    </form>
  );
};

export default Form;
