import React, { Component } from 'react';
import  axios  from 'axios';
import './App.css';


class App extends Component {

  state= {};
  inputs = {};
  send = async () => {
    const code = this.inputs.code.value && this.inputs.code.value.toLowerCase();
    const pseudo = this.inputs.pseudo.value && this.inputs.pseudo.value.toLowerCase();
    if (code.match(/^[a-z0-9]{4}$/) && pseudo) {
      console.log(`send ${pseudo} ${code}`);
      this.inputs.button.disabled = true;

      try {
        const result = await axios.post("https://ipw21gnfgd.execute-api.eu-west-1.amazonaws.com/dev/score", {pseudo, code});
        console.log(JSON.stringify(result));
        this.setState({message: "Vos points ont été enregistrés"});
      } catch (e) {
        console.log(JSON.stringify(e));
        this.setState({message: e.response.data.message});
      }
      this.inputs.button.disabled = false;
    }
    else {
      this.setState({message: "Code et/ou Pseudo invalide"});
    }
    setTimeout(() => this.setState({message: ''}), 5000);
  };
  render() {
    return (<div>
      <h1>Ajout de points</h1>
      <div><label>pseudo</label> <input name="pseudo" placeholder="votre pseudo" required ref={input => this.inputs.pseudo = input} type="text"/></div>
      <div><label>code</label> <input name="code" placeholder="code à 4 caractères" required ref={input => this.inputs.code = input} type="text"/></div>
      <button ref={input => this.inputs.button = input} onClick={this.send}>Envoyer</button>
      <div>{this.state.message}</div>
    </div>);
  }
}

export default App;
