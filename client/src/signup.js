import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';

class Signup extends React.Component {
   constructor(props){
      super(props);
      this.state = {fname: '', lname: '', emailval:'',emailconfirmval:'', pwdval: '', pwdconfirmval: '', bdateval:'', countryval:''};
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleRedirect = this.handleRedirect.bind(this);
      this.validateForm = this.validateForm.bind(this);
   }

   validateForm(e){

      console.log(e.target.name)
      if(e.target.name=="fname"){

         this.setState({fnameval: e.target.value});
         let currentval = e.target.value;

         if (currentval == '') {
            console.log("fname", "Please enter your first name address");
         }
      }
      else if(e.target.name=="lname"){

         this.setState({lnameval: e.target.value});
         let currentval = e.target.value;

         if (currentval == '') {
            console.log("lname", "Please enter your last name address");
         }
      }
      else if(e.target.name=="email"){

         this.setState({emailval: e.target.value});
         let currentval = e.target.value;

         if (currentval == '') {
            console.log("email", "Please enter your email address");
         }

         if (currentval !== /^[a-zA-Z0-9]+@+[a-zA-Z0-9]+.+[A-z]/) {
            console.log("email", "Please enter a valid email address");
         }

      }
      else if(e.target.name=="emailconfirm"){

         this.setState({emailconfirmval: e.target.value});
         let currentval = e.target.value;

         if (currentval == '') {
            console.log("email", "Please enter your email address");
         }

         if (currentval !== /^[a-zA-Z0-9]+@+[a-zA-Z0-9]+.+[A-z]/) {
            console.log("email", "Please enter a valid email address");
         }

         if (currentval !== this.state.emailval) {
            console.log("email", "Please enter same email address");
         }

      }
      else if(e.target.name=="pwd"){
         this.setState({pwdval: e.target.value});
         let currentval = e.target.value;

         if (currentval == '') {
         console.log("pwd", "Please enter your password");
         }
      }
      else if(e.target.name=="pwdconfirm"){
         this.setState({pwdconfirmval: e.target.value});
         let currentval = e.target.value;

         if (currentval == '') {
         console.log("pwd", "Please enter your password");
         }

         if (currentval !== this.state.pwdval) {
            console.log("email", "Please enter same password");
         }
      }
   }

   handleSubmit(e){

      var data = {
         fname: this.state.fnameval,
         lname: this.state.lnameval,
         email: this.state.emailval,
         emailconfirm: this.state.emailconfirmval,
         password: this.state.pwdval,
         passwordconfirm: this.state.pwdconfirmval,
         bdate: this.state.bdateval,
         country: this.state.countryval
      }
      e.preventDefault();
      //post for user authentication
      fetch("http://localhost:5000/usr/local", {
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
        // this.props.history.push('/');
      }

   }
   render() {
      return (
         <div className='login-form'>
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
                     {' '}Sign up
                  </Header>

               
                  <Form size='large'>
                     <Segment stacked>
                        <Form.Input
                          fluid
                          placeholder='First Name'
                          name='fname'
                          value={this.state.fnameval}
                          onChange={this.validateForm}
                        />
                        <Form.Input
                          fluid
                          placeholder='Last Name'
                          name='lname'
                          value={this.state.lnameval}
                          onChange={this.validateForm}
                        />
                        <Form.Input
                          fluid
                          placeholder='Email'
                          name='email'
                          value={this.state.emailval}
                          onChange={this.validateForm}
                        />
                        <Form.Input
                          fluid
                          placeholder='Email Confirmation'
                          name='emailconfirm'
                          value={this.state.emailconfirmval}
                          onChange={this.validateForm}
                        />
                        <Form.Input
                          fluid
                          placeholder='Password'
                          name='pwd'
                          value={this.state.pwdval}
                          onChange={this.validateForm}
                        />
                        <Form.Input
                          fluid
                          placeholder='Password Confirmation'
                          name='pwdconfirm'
                          value={this.state.pwdconfirmval}
                          onChange={this.validateForm}
                        />
                        <Button color='teal' fluid size='large' onClick={this.handleSubmit}>Login</Button>
                     </Segment>
                  </Form>
               </Grid.Column>
            </Grid>
         </div>

      );
   }
}

export default Signup;