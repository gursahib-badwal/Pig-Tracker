import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {FormsModule} from '@angular/forms';
import {MatSortModule} from '@angular/material/sort';
import {Sort} from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http'
import { v4 as uuidv4 } from 'uuid';
import * as L from 'leaflet';


// need to add to make leaflet icons work
import { icon, Marker } from 'leaflet';
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
}); 
Marker.prototype.options.icon = iconDefault;


///////////////////////////////////////////////////


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  private map:any;
  temp_arr:any;
  
  ngAfterViewInit(): void { 
    this.map = L.map('mapid').setView([49.2, -123], 11);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ3Vyc2FoaWIiLCJhIjoiY2xiOXR2enV3MDJnYTNucGJjaGt6dXRiZyJ9.IzYa4QfEzWbdwXyZcOjGvg', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1
    }).addTo(this.map);

    // L.marker([49.2276, -123.0076]).addTo(this.map)
    // .bindPopup("<b>Metrotown</b><br />cases reported.").openPopup();

    // L.marker([49.1867, -122.8490]).addTo(this.map)
    // .bindPopup("<b>SFU Surrey</b><br />cases reported.").openPopup();

      this.http.get<Object>('https://272.selfip.net/apps/oKC2JR8aOl/collections/Gursahib/documents/')
    .subscribe((data:any)=>{
      this.temp_arr = data;
      for (let i=0;i <this.temp_arr.length;i++){
        let counter = 0;


        for (let j =i+1; j< this.temp_arr.length - (i+1); j++){
          if (this.temp_arr[i].data.latitude == this.temp_arr[j].data.latitude && this.temp_arr[i].data.latitude == this.temp_arr[j].data.latitude){
            counter++;
          }
        }
        L.marker([parseFloat(this.temp_arr[i].data.latitude), parseFloat(this.temp_arr[i].data.longitude)]).addTo(this.map)
        .bindPopup("<b>"+this.temp_arr[i].data.location+"<br>Case Reported").openPopup();
        
      }
      // this.temp_arr = data;
      console.log(this.temp_arr);
      // this should go in the peopleService component
    })

  }






  title = 'Final-Project';
  reportForm: FormGroup;
  report_arr:any;
   NAME:string="";
   CONTACT:number = 0;
   P_BREED:string = "";
   P_ID:string = "";
   LOC:string = "";
   LONG:number = 0;
   LAT: number = 0;
   EXTRA:string = "";
   DATE:any = "";

  //  sortedData: any;
  constructor( private fb:FormBuilder, private http: HttpClient){
    this.report_arr = [];
    
    this.reportForm = this.fb.group({
      name: ['', Validators.required],
      contact: [0, Validators.required],
      pig_breed: ['', Validators.required],
      pig_id: ['', Validators.required],
      location: ['', Validators.required],
      longitude: [0, Validators.required],
      latitude: [0, Validators.required],
      extra: ['', Validators.required],
      uuid: uuidv4(),
      dt: (new Date().getTime())


      
    })

    // this.sortedData = this.report_arr.slice();
  }

  sortData(sort: Sort) {
    const data = this.report_arr.slice();
    if (!sort.active || sort.direction === '') {
      this.report_arr = data;
      return;
    }

    this.report_arr = data.sort((a: any, b:any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'location':
          return compare(a.data.location, b.data.location, isAsc);
        case 'name':
          return compare(a.data.name, b.data.name, isAsc);
          case 'dt':
          return compare(a.data.uuid, b.data.uuid, isAsc);
        default:
          return 0;
      }
    });
    console.log(this.report_arr);
  }

  // reset():void {
  //   this.reportForm.reset();
  // }
  addItem():void {




      // else {
        this.report_arr.push(this.reportForm.value);
        console.log(this.report_arr);
        // let x = uuidv4();
        this.http.post('https://272.selfip.net/apps/oKC2JR8aOl/collections/Gursahib/documents/',
        {"key":this.reportForm.value.uuid , "data":this.reportForm.value}
        ).subscribe((data:any)=>{
          // console.log(data)
          console.log(this.report_arr);
        })
        this.reportForm.value.uuid = uuidv4();
        //  this.reportForm.reset();
        this.close_form();
        window.location.reload();
      // }

    // this.DATE = new Date();
  }

  removeItem(element: any, key:string){
      let pass:string|null = prompt("If you want to delete this pig report then please enter the password and click on OK otherwise click Cancel");
      if(pass == "OINK!!"){
        console.log(element);
        this.http.delete('https://272.selfip.net/apps/oKC2JR8aOl/collections/Gursahib/documents/' + key)
        .subscribe((data:any) => {
          console.log(data);
          window.location.reload();
        });
  
        this.report_arr.forEach((value:any , index:any) => {
          if (value == element){
            this.report_arr.splice(index,1);
          }
        });
      }

      else if (pass == null || pass == ""){

      }

      else {
        alert("The password you entered is incorrect.")
      }



  }

  visible:boolean = false;
  visible_info:boolean = false;

  open_form() {
    this.visible = true;
  }

  close_form(){
    this.visible = false;
    this.reportForm.reset();
  }

  open_info(){
    this.visible_info = true;
  }

  close_info(){
    this.visible_info = false;
  }

  more_info(reporter:any) {
    
    this.NAME = reporter.name;
    this.CONTACT = reporter.contact;
    this.P_BREED = reporter.pig_breed;
    this.P_ID = reporter.pig_id;
    this.LOC = reporter.location;
    this.LONG = reporter.longitude;
    this.LAT = reporter.latitude;
    this.EXTRA = reporter.extra;
    // this.DATE = reporter.dt;
    this.open_info();
  }
//htttp here
  ngOnInit(): void {
    this.http.get<Object>('https://272.selfip.net/apps/oKC2JR8aOl/collections/Gursahib/documents/')
    .subscribe((data:any)=>{
      this.report_arr = data;
      // this.temp_arr = data;
      console.log(this.report_arr);
      // this should go in the peopleService component
    })
}




}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

// function time_compare(a: number | string, b: number | string, isAsc: boolean) {
//   if (a > b){
//     if(isAsc){
//       return 1;
//     }
//     else {
//       return -1;
//     }
//   }

//   else {

//       if(isAsc){
//         return -1;
//       }
//       else {
//         return 1;
//       }
    
//   }

// }



