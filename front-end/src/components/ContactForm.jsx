import React, { useState } from 'react';
import FormWaveUP from '../waves/FormWaveUP';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
    
        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbwC6StexbSrEQzLG3ZEhtpvSgsOxSqcqk5FccNnCz9TjaujgdRKaz_jva9oeGog3suA/exec', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
            });
    
            if (response.ok) {
                const result = await response.json();
                if (result && result.message) {
                    console.log(result);
                    setSuccessMessage('Pesan berhasil dikirim!');
                } else {
                    setErrorMessage('Received empty or malformed response from server.');
                }
            } else {
                const errorData = await response.json();
                setErrorMessage(`Error submitting form: ${errorData.message}`);
                console.error('Error submitting form:', errorData);
            }
        } catch (error) {
            setErrorMessage('Network error. Please try again later.');
            console.error('Network error:', error);
        }
    };

return (
    <section className="relative contactform mt-[100px] md:mt-[200px]"> {/* Mengurangi margin atas di mobile */}
        <FormWaveUP />
        <div className="flex justify-center items-center min-h-screen bg-[#8c2b7a] py-10">
            <form 
                onSubmit={handleSubmit} 
                className="p-6 md:p-8 w-[90%] md:w-full md:max-w-2xl bg-white rounded-md shadow-lg"
            >
                <h2
                    className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center text-black"
                    data-aos="fade-down-left"
                    data-aos-delay="500"
                    data-aos-duration="800"
                    data-aos-offset="300"
                >
                    Contact Us ☎️
                </h2>
                <h3
                    className="text-center text-sm md:text-base mb-4 md:mb-6 px-2"
                    data-aos="fade-down-right"
                    data-aos-delay="500"
                    data-aos-duration="800"
                    data-aos-offset="300"
                >
                    Get in touch for collaboration opportunities and exciting tech discussions. Let's innovate together!
                </h3>

                <div className="mb-4 md:mb-6" data-aos="fade-down-left" data-aos-delay="500" data-aos-duration="800" data-aos-offset="200">
                    <label htmlFor="name" className="block text-base md:text-lg font-medium text-gray-700 mb-1 md:mb-2">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 text-sm md:text-base"
                        required
                    />
                </div>

                <div className="mb-4 md:mb-6" data-aos="fade-down-right" data-aos-delay="500" data-aos-duration="800" data-aos-offset="200">
                    <label htmlFor="email" className="block text-base md:text-lg font-medium text-gray-700 mb-1 md:mb-2">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 text-sm md:text-base"
                        required
                    />
                </div>

                <div className="mb-4 md:mb-6" data-aos="fade-down-left" data-aos-delay="500" data-aos-duration="800" data-aos-offset="200">
                    <label htmlFor="message" className="block text-base md:text-lg font-medium text-gray-700 mb-1 md:mb-2">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 text-sm md:text-base"
                        rows="4"
                        required
                    ></textarea>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="w-full px-4 py-2 md:py-3 bg-black text-white font-medium rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
                        data-aos="zoom-in"
                        data-aos-delay="500"
                        data-aos-duration="800"
                    >
                        Submit
                    </button>
                </div>
                {successMessage && <p className="mt-4 text-green-600 text-sm text-center">{successMessage}</p>}
                {errorMessage && <p className="mt-4 text-red-600 text-sm text-center">{errorMessage}</p>}
            </form>
        </div>
    </section>
);
};

export default ContactForm;
