document.addEventListener("DOMContentLoaded", () => {

    // Initialize EmailJS
    emailjs.init("7gVl1fBS3ApcOivoycwOT"); // Example: emailjs.init("XyZ123AbC");

    const form = document.getElementById("waitlistForm");
    const successMsg = document.getElementById("waitlistSuccess");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = {
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value,
            breed: form.breed.value,
                        gender: form.gender.value,
            message: form.message.value
        };

        try {
            const response = await emailjs.send(
                "service_spaniels",     // Example: "service_abc123"
                "template_hkq8nwt",    // Example: "template_xyz789"
                formData
            );

            if (response.status === 200) {
                successMsg.style.display = "block";
                form.reset();
            }

        } catch (error) {
            console.error("EmailJS Error:", error);
            alert("There was an issue submitting your form. Please try again.");
        }
    });

});
