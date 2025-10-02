import React from 'react';

const LoginSection: React.FC = () => (
    <section className="Login-section" id="login">
        <h2>Accedi</h2>
        <form>
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
        <p>Non hai un account? <a href="#">Registrati</a></p>
    </section>
);

export default LoginSection;
