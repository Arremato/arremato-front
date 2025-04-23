import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function AuthForm({ type }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (type === 'sign-up') {
      const { data, error } = await supabase.auth.signUp({ email, password });
      console.log("CADASTROU", data)
      setMessage(error ? error.message : 'Cadastro realizado com sucesso!');
    } else if (type === 'sign-in') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      console.log("LOGOU", data)
      setMessage(error ? error.message : 'Login realizado com sucesso!');
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded w-full max-w-sm mx-auto">
      <h2 className="text-lg font-bold mb-4">{type === 'sign-up' ? 'Cadastrar' : 'Entrar'}</h2>
      <form onSubmit={handleSubmit}>
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
          {type === 'sign-up' ? 'Cadastrar' : 'Entrar'}
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
    </div>
  );
}