import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';

class Login extends React.Component {
   constructor(props){
      super(props);
      this.state = {emailval:'', pwdval: ''};
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleRedirect = this.handleRedirect.bind(this);
      this.validateForm = this.validateForm.bind(this);
   }

   validateForm(e){

      if(e.target.name=="email"){

         this.setState({emailval: e.target.value});
         let currentval = e.target.value;

         if (currentval == '') {
         console.log("email", "Please enter your email address");
         }

         if (currentval !== /^[a-zA-Z0-9]+@+[a-zA-Z0-9]+.+[A-z]/) {
         console.log("email", "Please enter a valid email address");
         }

      }
      else{
         this.setState({pwdval: e.target.value});
         let currentval = e.target.value;

         if (currentval == '') {
         console.log("pwd", "Please enter your password");
         }

      }
   }

   handleSubmit(e){

      var data = {
         email: this.state.emailval,
         password: this.state.pwdval
      }
      e.preventDefault();
      fetch("http://localhost:5000/auth/login", {
         method: "POST",
         mode: 'cors',
         body: JSON.stringify( data ),
         headers: new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json',
         })
      }).then(this.handleRedirect)                    
   }

   handleRedirect(res){
      if( res.status === 200 ){
          // redirect here
        res.json().then((data)=>{
            this.props.history.push('/');
          }
        );
      }else {
         console.log("err");
        // Something went wrong here
      }

   }
   render() {
      return (
         <div className='login-form'>
         {/*
         Heads up! The styles below are necessary for the correct render of this example.
         You can do same with CSS, the main idea is that all the elements up to the `Grid`
         below must have a height of 100%.
         */}
         <style>{`
            body > div,
            body > div > div,
            body > div > div > div.login-form {
              height: 100%;
            }
         `}</style>
         <Grid
         textAlign='center'
         style={{ height: '100%' }}
         verticalAlign='middle'
         >
         <Grid.Column style={{ maxWidth: 450 }}>
           <Header as='h2' color='teal' textAlign='center'>
             <Image src='/logo.png' />
             {' '}Log-in to your account
           </Header>
           <Form size='large'>
             <Segment stacked>
               <Form.Input
                 fluid
                 icon='user'
                 iconPosition='left'
                 placeholder='E-mail address'
                 name='email'
                 value={this.state.emailval}
                 onChange={this.validateForm}
               />
               <Form.Input
                 fluid
                 icon='lock'
                 iconPosition='left'
                 placeholder='Password'
                 type='password'
                 name='pwd'
                 value={this.state.pwdval}
                 onChange={this.validateForm}
               />

               <Button color='teal' fluid size='large' onClick={this.handleSubmit}>Login</Button>
             </Segment>
           </Form>
           <Message>
            Want to sign in with
            <a href="http://localhost:5000/auth/facebook"> Facebook</a>?<br/>
            <a href="http://127.0.0.1:5000/auth/twitter">Twitter</a><br/>
            <a href="http://localhost:5000/auth/google">Google</a><br/>
            <a href="http://localhost:5000/auth/linkedin">LinkedIn</a><br/>
           </Message>
           <Message>
             New to us? <a href='/signup/profile'>Sign Up</a>
           </Message>
         </Grid.Column>
         </Grid>
         </div>
      );
   }
}

export default Login;