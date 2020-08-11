import React,{ Component } from 'react';
import Modal from 'react-bootstrap/Modal'
import Venue from './Venue';
import './App.css';

var clientId = 'KUDA2N03YC33ECT3FOQ0WNYBMUHLJPWIT3VJKYNPS3LHV0CK'
var clientSecret = '2VCKPISB4ZUWJ3Z3M2XDKAQOWB2BUS4FFEB4WTNAZTXXK5PD'
var key = '?client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20200806'


class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      venues:[],
      
      isModalOpen:false,
      modalVenue:{
        address: "369 Queen Street",
        category: "Record Shop",
        id: "4b4d4133f964a52070cf26e3",
        name: "Real Groovy",
        photo: "https://fastly.4sqi.net/img/general/300x300/14834930_ZpkKmLsnmEzETM1usPvNzBP8sat60NWjLwnvq3Uv8UM.jpg"
      }

    }
  }

  loadVenues = () =>{
    var latlong = '-36.856905,174.764493'
    var url = ' https://api.foursquare.com/v2/venues/explore'+key+'&ll='+latlong


    //make an Ajax request to endpoint

    fetch(url)
    .then((res)=>{
        return res.json()
    }) 
    .then((data)=>{
       return data.response.groups[0].items
      
    })
    .then((data)=>{
        return data.map((item)=>{
            var venue = {
                id:item.venue.id,
                name:item.venue.name,
                address:item.venue.location.address,
                category:item.venue.categories[0].shortName
            }
            return venue
        })
       
     })
     .then((data)=>{
         this.setState({
           venues:data
         })
      
     })



  }


  loadVenue = (id)=>{

    var url = 'http://api.foursquare.com/v2/venues/'+ id + key

    fetch(url)
    .then(res=>res.json())
    .then(data=>{
        var item = data.response.venue
        var venue = {
          id:item.id,
          name:item.name,
          address:item.location.address,
          city:item.location.city,
          category:item.categories[0].shortName,
          description:item.description,
          photo:item.bestPhoto.prefix + '500x300' + item.bestPhoto.suffix
        }
      return venue
      
    })
    .then(data=>{
      this.setState({
        modalVenue:data
      })
     
    })
  }

  openModal = ()=>{
    this.setState({
      isModalOpen:true
    })
  }
  closeModal = ()=>{
    this.setState({
      isModalOpen:false
    })
  }

  componentDidMount = () => {
    this.loadVenues()

  } 

  render(){
    return(
      <div className="app">
        <div className="container">
          <div className="venues">
            {
              this.state.venues.map((item)=>{
                var venueProps = {
                  key: item.id,
                  ...item,
                  openModal: this.openModal,
                  loadVenue: this.loadVenue,
                }
                return (
                  <Venue {...venueProps}/>
                )
              })
            }
          </div> 
          <div className="venue-filters">
            <div className="btn-group btn-group-toggle" data-toggle="buttons">
                <div role="group" className="btn-group btn-group-toggle">
                    <label className="venue-filter btn active btn-primary">
                      <input name="venue-filter" type="radio" autocomplete="off" value="all" checked=""/>All
                  </label>
                    <label className="venue-filter btn btn-primary">
                      <input name="venue-filter" type="radio" autocomplete="off" value="food"/>Food
                    </label>
                    <label className="venue-filter btn btn-primary">
                      <input name="venue-filter" type="radio" autocomplete="off" value="drinks"/>Drinks
                    </label>
                    <label className="venue-filter btn btn-primary">
                      <input name="venue-filter" type="radio" autocomplete="off" value="others"/>Others
                    </label>
                </div>
              </div>
          </div>
        </div>
        <Modal show = {this.state.isModalOpen} onHide ={this.closeModal}>

          <Modal.Body>

            <div className="venue-popup-body row">
              <div className="col-6">
                <h1 className="venue-name">{this.state.modalVenue.name}</h1>
                <p>{this.state.modalVenue.address}</p>
                <p>Auckland</p>
                <p><span className="badge venue-type">{this.state.modalVenue.category}</span></p>
              </div>
              <div className="col-6">
                <img src={this.state.modalVenue.photo} className="img-fluid" alt="" />
              </div>
            </div>

        </Modal.Body>
        
        </Modal>
      </div>
    )
  }
}

export default App;
