import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import  axios  from 'axios';
import './App.css';


class Index extends Component {

  state= {};
  inputs = {};
  send = async () => {
    const code = this.inputs.code.value;
    const pseudo = this.inputs.pseudo.value;
    if (pseudo === 'admin' && code === 'blastpower') {
      console.log(JSON.stringify(this.props, null, 2));
      this.setState({admin:true});
      return;
    }
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
      {this.state.admin && (
        <div>
          <ul>
            <li><Link to={`/code/${this.inputs.code.value}`}>Ajouter un code</Link></li>
            <li><Link to={`/user/${this.inputs.code.value}`}>Ajouter un pseudo</Link></li>
          </ul>
        </div>
      )}
    </div>);
  }
}

class Code extends Component {
  constructor(props) {
    super(props);
    console.log('>>>>>>code')
    this.state = {
      message: props.match.params.code !== 'blastpower' ? "vous n'êtes pas autorisé": "",
      authorized: props.match.params.code === 'blastpower'
    };

  }
  inputs = {};
  send = async () => {
    const label = this.inputs.label.value;
    const points = +this.inputs.points.value;
    const nbDays = +this.inputs.nbDays.value;
    const nbPlayers = +this.inputs.nbPlayers.value;
    if(label && points > 0 && nbDays > 0 && nbPlayers > 0) {
      console.log(`send ${label} ${points} ${nbDays} ${nbPlayers}`);
      this.inputs.button.disabled = true;

      try {
        const result = await axios.post("https://ipw21gnfgd.execute-api.eu-west-1.amazonaws.com/dev/code", {label, points, nbPlayers, nbDays});
        console.log(JSON.stringify(result));

        this.setState({code: result.data.code});
      } catch (e) {
        console.log(JSON.stringify(e));
        this.setState({message: e.response.data.message});
      }
      this.inputs.button.disabled = false;
    }
    else {
      this.setState({message: "Remplissez tous les champs"});
    }
    setTimeout(() => this.setState({message: ''}), 5000);
  };
  render({match} = this.props) {
    return (<div>
      <h1>Création de code</h1>
      { this.state.authorized && (
        <div>
          <div><label>nom activité</label> <input name="label" placeholder="nom de l'activité" required ref={input => this.inputs.label = input} type="text"/></div>
          <div><label>points</label> <input name="points" required ref={input => this.inputs.points = input} type="number" min={1} /></div>
          <div><label>nombre de participants</label> <input name="nbPlayers" required ref={input => this.inputs.nbPlayers = input} type="number" min={1}/></div>
          <div><label>nombre de jours actifs</label> <input name="nbDays" required ref={input => this.inputs.nbDays = input} type="number" min={1}/></div>
          <button ref={input => this.inputs.button = input} onClick={this.send}>Envoyer</button>
        </div>
      )}
      <div>{this.state.message}</div>
      {this.state.code && (<div>
        Le nouveau code est <strong>{this.state.code}</strong> (mémorisez le)
      </div>)}
    </div>);
  }
}

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: props.match.params.code !== 'blastpower' ? "vous n'êtes pas autorisé": "",
      authorized: props.match.params.code === 'blastpower'
    };

  }
  inputs = {};
  send = async () => {
    let pseudo = this.inputs.pseudo.value;
    if(pseudo) {
      pseudo = pseudo.toLocaleLowerCase();
      console.log(`send ${pseudo}`);
      this.inputs.button.disabled = true;

      try {
        const result = await axios.post("https://ipw21gnfgd.execute-api.eu-west-1.amazonaws.com/dev/user", {pseudo});
        console.log(JSON.stringify(result));

        this.setState({message: `le pseudo ${result.data.pseudo} a bien été enregistré`});
      } catch (e) {
        console.log(JSON.stringify(e));
        this.setState({message: e.response.data.message});
      }
      this.inputs.button.disabled = false;
    }
    else {
      this.setState({message: "Donnez un pseudo"});
    }
    setTimeout(() => this.setState({message: ''}), 5000);
  };
  render({match} = this.props) {
    return (<div>
      <h1>Ajout d'un pseudo</h1>
      { this.state.authorized && (
        <div>
          <div><label>pseudo</label> <input name="pseudo" placeholder="nouveau pseudo" required ref={input => this.inputs.pseudo = input} type="text"/></div>
          <button ref={input => this.inputs.button = input} onClick={this.send}>Envoyer</button>
        </div>
      )}
      <div>{this.state.message}</div>
    </div>);
  }
}

class App extends Component {
  render() {
    return (
      <Router basename="/">
        <div>
          <Route path="/" exact component={Index} />
          <Route path="/code/:code" component={Code} />
          <Route path="/user/:code" component={User} />
        </div>
      </Router>
    );
  }
}

export default App;
