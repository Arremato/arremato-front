import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("Vai fazer login");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log("Login feito: ", data);
    if (error) {
      console.log("Erro ao fazer login: ", error);
      setErrorMessage(error.message);
    } else {
      console.log("sucesso")
      window.location.href = '/';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white shadow rounded w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">Entrar</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 w-full"
          >
            Entrar
          </button>
        </form>
        {errorMessage && <p className="mt-4 text-sm text-red-500">{errorMessage}</p>}
      </div>
    </div>
  );
}