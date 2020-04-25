import React, { Component } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import ChatBot from 'react-simple-chatbot';
import axios from 'axios'
import SERVER from './helpers/config'
import { ThemeProvider } from 'styled-components';
import Badge from 'react-bootstrap/Badge'
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Spinner } from 'reactstrap';

let role = ''
let page = ''

class WebScraping extends Component {
  constructor(props) {
    super(props)
    this.state = {
      qHTML: []
    }
  }
  componentWillMount() {
    const { steps } = this.props;
    console.log('Here in the componnewillmount', steps)
    // setTimeout(() => {
    //   this.setState({ answer: "Call SuccessFull" })
    // }, 2000);


    let data = { q: steps.checkAnswer.value, flag: "True" }

    console.log('Here in the request for questions', SERVER.ROOT_URL + 'inference')
    //API Calls to get the data from backend
    axios.defaults.withCredentials = false;
    axios.post(SERVER.ROOT_URL + 'inference', data)
      .then((response) => {
        console.log(response);
        let map = response.data.response.map((el, i) => {
          console.log("Question", el);
          return (<div class="div1">
            <h5>{el.title}  <Badge variant="success" id='smart'>Smart Result</Badge></h5>
            <p><i>{el.description}</i></p>
            <a href={el.link} class="btn btn-primary" target="_blank">Visit Site</a>
            <br />
          </div>

          )
        })
        this.setState({ qHTML: map })
      }).catch(error => {
        console.log(error);
      })
  }
  render() {
    // let questionsElements = this.format();
    console.log('In the render method recived', this.state.qHTML)
    //this.props.triggerNextStep({trigger: 'checkanswer'})
    return (<div>
      {this.state.qHTML}
    </div>)
  }
}

class CustomOption extends Component {
  constructor(props) {
    super(props);

    this.state = {
      answer: '',
      gender: '',
      age: '',
      ques: [],
      qHTML: [],
      roleName: this.props.roleName,
      pageName: this.props.pageName,
      loading:false
    };
  }

  componentDidUpdate(prevProps) {
    console.log('da')
    if(prevProps.roleName !== this.props.roleName) {
      this.setState({roleName: this.props.roleName, pageName: this.props.pageName});
      console.log('das2')
      console.log(this.state)
    }
  }

  componentWillMount() {
    const { steps } = this.props;
    console.log('Here in the componnewillmount', this.props)
    // setTimeout(() => {
    //   let questions = ["How","Hi are you testing the objects?","Others"]
    // }, 2000);

    let data = { Role: role, Page: page }

    //API Calls to get the data from backend
    axios.defaults.withCredentials = false;
    console.log(data)
    console.log('Here in the request for questions', SERVER.ROOT_URL + 'inference')
    axios.post(SERVER.ROOT_URL + 'getSuggestions', data)
      .then((response) => {
        console.log(response);
        if (response.data.length == 0) {
          this.props.triggerNextStep();
          return
        }
        let map = response.data.suggestions.map((el, i) => {
          console.log("Question", el);
          return <div><p class='div2' onClick={(e) => this.askQuestions(e, el)}>{el}</p><br /></div>
        })
        map.push(<div><p class='div2' onClick={(e) => this.askQuestions(e, 'Others')}>Others</p><br /></div>)
        this.setState({ qHTML: map, ques: response.data.suggestions })
      }, (error) => {
        console.log(error);
        this.props.triggerNextStep();

      });

  }

  componentWillReceiveProps = () => {
    console.log('here props updated!!')
  }

  askQuestions = (e, question) => {
    if (question === 'Others') {
      this.props.triggerNextStep();
      return
    }

    this.setState({loading:true, answer:''})
    console.log(question);
    let data = { q: question, flag: "False" }
    axios.defaults.withCredentials = false;
    axios.post(SERVER.ROOT_URL + 'inference', data)
      .then((response) => {
        this.setState({loading:false})
        console.log(response);
        this.setState({ answer: <div class='div3'>{response.data.response}</div> })
      }, (error) => {
        console.log(error);
        this.setState({ answer: "I cannot answer :(" })
      });

  }

  render() {
    // let questionsElements = this.format();
    console.log('In the render method recived', this.state.qHTML)
    //this.props.triggerNextStep({trigger: 'checkanswer'})
    return (<div>
      {this.state.qHTML}
      {this.state.answer}
      {this.state.loading?<Badge variant="success" id='smartgreen'>Loading Answer!</Badge>:<div></div>}

    </div>)
  }
}

class Answer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      answer: '',
      gender: [],
      age: '',
    };
  }

  componentWillMount() {
    const { steps } = this.props;
    console.log('Here in the componnewillmount', steps)
    // setTimeout(() => {
    //   this.setState({ answer: "Call SuccessFull" })
    // }, 2000);

    let data = { q: steps.checkAnswer.value, flag: "False" }

    //API Calls to get the data from backend
    axios.defaults.withCredentials = false;
    axios.post(SERVER.ROOT_URL + 'inference', data)
      .then((response) => {
        console.log(response);
        let ans  = [ <p>{response.data.response}</p>,<p><i>Are you satisfied by my answer? Please give feedback as yes or no below!</i></p>]
        this.setState({ answer: ans})
      }, (error) => {
        console.log(error);
        this.setState({ answer: "I cannot answer :(" })
      });

  }

  componentWillReceiveProps = () => {
    console.log('here props updated!!')
  }
  render() {
    console.log('In the render method recived')
    //this.props.triggerNextStep({trigger: 'checkanswer'})
    return (<div>

      {this.state.answer}
     

    </div>)
  }
}

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      roleName: '',
      pageName: '',
      pageOptions: []
    }
  }


  roleChangedHandler = (e) => {
    // this.setState({
    //     projectName:e.target.value
    // });
    let roleDef = e.target.value
    console.log('role hit', roleDef)

    if (roleDef == 'Tester') {
      let pageOptionsHtml = []
      pageOptionsHtml.push(<option value='Select'>Select</option>)
      pageOptionsHtml.push(<option value='Subscriptions'>Subscriptions</option>)
      pageOptionsHtml.push(<option value='UnapprovedApplications'>Unapproved Applications</option>)
      pageOptionsHtml.push(<option value='ReportBug'>Report Bug</option>)
      pageOptionsHtml.push(<option value='BugsListing'>Bugs Listing</option>)
      pageOptionsHtml.push(<option value='ScheduleTestRun'>Schedule Test Run</option>)
      pageOptionsHtml.push(<option value='RunTracker'>Run Tracker</option>)
      pageOptionsHtml.push(<option value='FileBrowser'>File Browser</option>)
      pageOptionsHtml.push(<option value='Community'>Community</option>)
      pageOptionsHtml.push(<option value='Dashboard'>Dashboard</option>)
      pageOptionsHtml.push(<option value='Profile'>Profile</option>)
      this.setState({ pageOptions: pageOptionsHtml, roleName:roleDef })
      role = roleDef
    }

    else if (roleDef == 'Manager') {
      let pageOptionsHtml = []
      pageOptionsHtml.push(<option value='Select'>Select</option>)
      pageOptionsHtml.push(<option value='Announcements'>Announcements</option>)
      pageOptionsHtml.push(<option value='PendingApprovals'>Pending Approvals</option>)
      pageOptionsHtml.push(<option value='AllProjects'>All Projects</option>)
      pageOptionsHtml.push(<option value='BugsListing'>Bugs Listing</option>)
      pageOptionsHtml.push(<option value='FileBrowser'>File Browser</option>)
      pageOptionsHtml.push(<option value='Community'>Community</option>)
      pageOptionsHtml.push(<option value='TesterLocation'>Tester Location</option>)
      pageOptionsHtml.push(<option value='Dashboard'>Dashboard</option>)
      pageOptionsHtml.push(<option value='BillingRates'>BillingRates</option>)
      pageOptionsHtml.push(<option value='Profile'>Profile</option>)
      // pageOptionsHtml.push(<option value='Profile'>Profile</option>)
      this.setState({ pageOptions: pageOptionsHtml, roleName:roleDef})
      role = roleDef
    }

    else {
      this.setState({ pageOptions: [] })
    }

  }

  pageChangedHandler = (e) => {
    page = e.target.value
  this.setState({
        pageName:page
    });
  
  }

  refresh = ()=>{
    window.location.reload()
  }
  render() {
    //let {steps} = this.state.;
    console.log('redered called', this.state)
    return (
      <div>
        {/* <h1 align="center">MTaaS ChatBot Testing</h1> */}
        <div style={{ "marginTop": "20px" }}>
          <div style={{ "marginLeft": "500px", "width": "10%", "float": "left" }}>
            <Form>
              <FormGroup>
                <Label for="role">Select Role</Label>
                <Input type="select" name="roleName" id="roleName" onChange={this.roleChangedHandler}>
                  <option value='Select'>Select</option>
                  <option value='Tester'>Tester</option>
                  <option value='Manager'>Manager</option>
                </Input>
              </FormGroup>
            </Form>
          </div>
          <div style={{ "marginLeft": "100px", "float": "left", "width": "auto" }}>
            <Form>
              <FormGroup>
                <Label for="role">Select Page</Label>
                <Input type="select" name="roleName" id="roleName" onChange={this.pageChangedHandler}>
                  {this.state.pageOptions}

                </Input>
              </FormGroup>
            </Form>
          </div>
          <br/> 
          <div style={{ "marginLeft": "50px", "float": "left"}}>
            <button onClick={this.refresh} class='btn btn-primary'>Refresh Test Parameters</button>
            </div>
          <ChatBot
            recognitionEnable={true}
            speechSynthesis={{ enable: true, lang: 'en' }}
            className='kNrYDJ'
            triggerNextStep={this.triggerNextStep}
            headerTitle="MTaaS ChatBot"
            handleEnd={this.handleEnd}
            steps={[{
              id: 'welcome',
              message: 'Welcome to MTaaS, What can I call you?',
              trigger: "welcomenext"
            }, {
              id: 'welcomenext',
              user: true,
              validator: (value) => {
                if (isNaN(value)) {
                  return true;
                } else if (isNaN(value)) {
                  return 'value must String';
                }
              },
              trigger: "welcome3",
            },
            {
              id: "welcome3",
              message: 'Hi {previousValue}! How can I help you',
              trigger: "customOption"
            },
            {
              id: "customOption",
              component: <CustomOption roleName={this.state.roleName} pageName={this.state.pageName} />,
              waitAction: true,
              trigger: 'checkAnswer',
            },
            {
              id: "custom",
              component: <Answer />,
              asMessage: true,
              trigger: 'FeedbackCheckerText',
            },
            {
              id: "FeedbackCheckerText",
              message: 'Are you satisfied with the answer?',
              trigger: 'FeedbackChecker',
            },
            {
              id: "FeedbackChecker",
              options: [
                { value: 1, label: 'Yes', trigger: 'Yes' },
                { value: 2, label: 'No', trigger: 'No' }
              ],
            },
            {
              id: "Answer",
              component: <Answer />,
              asMessage: true,
              trigger: 'FeedbackChecker',
            },
            {
              id: "Yes",
              message: 'Awesome!',
              end:true,
            },
            {
              id: 'No',
              message: 'Oh, I will try to learn!, Let me pull data from the internet!',
              trigger: "WebScraping"
            },
            // {
            //   id: 'No',
            //   user: true,
            //   trigger: "WebScraping"
            // },
            {
              id: 'WebScraping',
              component: <WebScraping />,
              end: true,
            },
            // {
            //   id: 'No',
            //   component: <WebScraping/>,
            //   trigger: 'customOption',
            // },
            {
              id: 'checkAnswer',
              user: true,
              trigger: "Answer"

            }]}
            floating={true}
            floatingStyle={{
              left: 'calc(50% - 28px)',
              right: 'initial',
              transformOrigin: 'bottom center',
              borderRadius: 0,
            }}
            style={{
              left: 'calc(50% - 175px)',
            }}
          />

        </div>
      </div>
    );
  }
}
//Export the App component so that it can be used in index.js
export default App;
