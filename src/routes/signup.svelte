<script>
  import { supabase } from "$lib/supabase";
  let email = "";
  let password = "";
  let errorMessage = "";

  const handleSignup = async () => {
    errorMessage = "";
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      errorMessage = error.message;
    } else {
      alert("Signup successful! Please check your email for confirmation.");
    }
  };
</script>

<main>
  <h1>Sign Up</h1>
  <form on:submit|preventDefault={handleSignup}>
    <label for="email">Email:</label>
    <input id="email" type="email" bind:value={email} required />

    <label for="password">Password:</label>
    <input id="password" type="password" bind:value={password} required />

    <button type="submit">Sign Up</button>
  </form>

  {#if errorMessage}
    <p style="color: red;">{errorMessage}</p>
  {/if}
</main>

<style>
  main {
    max-width: 400px;
    margin: 0 auto;
    padding: 1rem;
    font-family: Arial, sans-serif;
  }

  label {
    display: block;
    margin-top: 1rem;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.5rem;
  }

  button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }
</style>
