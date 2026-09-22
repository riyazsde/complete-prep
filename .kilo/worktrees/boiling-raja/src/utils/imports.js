import React, { useState, useEffect, useContext, useRef } from "react";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";

import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import 'swiper/css/bundle';
import 'react-circular-progressbar/dist/styles.css';
import 'react-calendar/dist/Calendar.css';
import {
  Button,
  
  Navbar,
  Container,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { Icon } from "@iconify/react";

export {
  React,
  useState,
  useEffect,
  useContext,
  useRef,
  Router,
  Route,
  Routes,
  Link,
  useNavigate,
  useParams,
  axios,
  Button,
  Form,
  Navbar,
  Container,
  Row,
  Col,
  toast,
  Toaster,
  Icon,
  useForm,
};
