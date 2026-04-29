import React, { useEffect, useRef, useState } from 'react';
import { Eye, MapPin, Clock, TrendingUp, CheckCircle, Users, Building2, BarChart3, Shield, Zap, ArrowRight, Sprout, GraduationCap, Droplets, Zap as Electric, Construction, Building, Award, Activity, Phone, Mail, MapPinned, Star, Calendar } from 'lucide-react';
import * as THREE from 'three';
import { Link,NavLink } from 'react-router-dom';
import { routes } from '../../data/routes';

const Hero = () => {
  const canvasRef = useRef(null);
  const [stats, setStats] = useState({ complaints: 0, resolved: 0, departments: 0 });
  const [activeFlow, setActiveFlow] = useState(0);
  const [activeDept, setActiveDept] = useState(0);

  useEffect(() => {
    // Animate stats
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setStats({
        complaints: Math.floor(15847 * progress),
        resolved: Math.floor(14203 * progress),
        departments: Math.floor(28 * progress)
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    // Three.js setup
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    camera.position.z = 5;

    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 10;
      posArray[i + 1] = (Math.random() - 0.5) * 10;
      posArray[i + 2] = (Math.random() - 0.5) * 10;

      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i] = 0.4; colors[i + 1] = 0.7; colors[i + 2] = 1;
      } else if (colorChoice < 0.66) {
        colors[i] = 0.5; colors[i + 1] = 0.3; colors[i + 2] = 1;
      } else {
        colors[i] = 0.2; colors[i + 1] = 0.9; colors[i + 2] = 0.7;
      }
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;

      const positions = particlesGeometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(Date.now() * 0.001 + i) * 0.002;
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cycle through flow animations
    const flowTimer = setInterval(() => {
      setActiveFlow(prev => (prev + 1) % 3);
    }, 3000);

    // Cycle through departments
    const deptTimer = setInterval(() => {
      setActiveDept(prev => (prev + 1) % 6);
    }, 2500);

    return () => {
      clearInterval(timer);
      clearInterval(flowTimer);
      clearInterval(deptTimer);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
    };
  }, []);

  const flows = [
    { icon: MapPin, text: "Complaint Filed", color: "from-blue-500 to-cyan-500" },
    { icon: Building2, text: "Routed to Department", color: "from-purple-500 to-pink-500" },
    { icon: CheckCircle, text: "Issue Resolved", color: "from-green-500 to-emerald-500" }
  ];

  const departments = [
    { icon: Construction, name: "Roads & Infrastructure", count: "3,245", resolved: "2,891", color: "orange" },
    { icon: Droplets, name: "Water Supply", count: "2,156", resolved: "1,987", color: "blue" },
    { icon: Electric, name: "Electricity", count: "1,847", resolved: "1,654", color: "yellow" },
    { icon: Building, name: "Municipal Services", count: "2,934", resolved: "2,645", color: "green" },
    { icon: Sprout, name: "Agriculture", count: "1,523", resolved: "1,398", color: "emerald" },
    { icon: GraduationCap, name: "Education", count: "987", resolved: "876", color: "purple" }
  ];

  const solvedCases = [
    {
      title: "Road Pothole Repair",
      location: "MG Road, Sector 15",
      before: "🚧",
      after: "✅",
      days: "3 days",
      dept: "Roads & Infrastructure",
      rating: 4.8
    },
    {
      title: "Water Pipeline Leak",
      location: "Nehru Nagar, Ward 8",
      before: "💧",
      after: "✅",
      days: "2 days",
      dept: "Water Supply",
      rating: 4.9
    },
    {
      title: "Street Light Repair",
      location: "Park Avenue, Block C",
      before: "💡",
      after: "✅",
      days: "1 day",
      dept: "Electricity",
      rating: 5.0
    },
    {
      title: "Garbage Collection",
      location: "Gandhi Colony, Sector 22",
      before: "🗑️",
      after: "✅",
      days: "4 hours",
      dept: "Municipal Services",
      rating: 4.7
    }
  ];

  const states = [
    { name: "Maharashtra", districts: 36, complaints: 4521 },
    { name: "Karnataka", districts: 31, complaints: 3876 },
    { name: "Tamil Nadu", districts: 38, complaints: 4234 },
    { name: "Gujarat", districts: 33, complaints: 3654 },
    { name: "Madhya Pradesh", districts: 52, complaints: 5123 },
    { name: "Rajasthan", districts: 33, complaints: 3234 },
    { name: "Uttar Pradesh", districts: 75, complaints: 6789 },
    { name: "Delhi", districts: 11, complaints: 2456 }
  ];

  const features = [
    {
      icon: Activity,
      title: "Real-Time Tracking",
      desc: "Monitor complaint status from filing to resolution with live updates"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      desc: "Comprehensive insights for authorities to analyze department performance"
    },
    {
      icon: Shield,
      title: "Transparent System",
      desc: "Complete visibility into complaint handling and resolution timelines"
    },
    {
      icon: Award,
      title: "Performance Metrics",
      desc: "Track department efficiency and citizen satisfaction ratings"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.4 }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-pulse" style={{ animationDuration: '4s' }} />

        <div className="relative z-10">
          <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
                <Eye className="w-7 h-7" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Civic Eye
              </span>
            </div>
         
            <div className="flex gap-4">
              <NavLink to={routes.userLogin} className="px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 border border-white/20 hover:border-white/40">
                User Login
              </NavLink>
              <NavLink to={routes.deptLogin} className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70">
                Department Login
              </NavLink>
            </div>
          </nav>
          <div className='container mx-auto md:px-24 py-6 flex items-center md:gap-10'>
              <Link
                to={'/'}
                className="text-[#ffff]  transition-colors duration-200 md:font-medium px-2 py-1"
              >
                <button className="px-2 py-3 md:px-6 md:py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 border border-white/20 hover:border-white/40">
                  Hero
                </button>
              </Link>
              <Link
                to={routes.aboutUs}
                className="text-[#ffff]  transition-colors duration-200 md:font-medium px-2 py-2 "
              >
                <button className="px-2 py-3 md:px-6 md:py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 border border-white/20 hover:border-white/40">
                  About Us
                </button>
              </Link>
              <Link
                to={routes.departmentWorks}
                className="text-[#ffff]  transition-colors duration-200 md:font-medium px-2 py-1 "
              >
                <button className="px-2 py-3 md:px-6 md:py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 border border-white/20 hover:border-white/40">
                  View Department Works
                </button>

              </Link>
              <Link
                to={routes.departmentInfo}
                className="text-[#ffff]  transition-colors duration-200 md:font-medium px-2 py-1 "
              >
                <button className="px-2 py-3 md:px-6 md:py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 border border-white/20 hover:border-white/40">
                  View Department Info
                </button>

              </Link>
              <Link
                to={routes.contactSupport}
                className="text-[#ffff]  transition-colors duration-200 md:font-medium px-2 py-1 "
              >
                <button className="px-2 py-3 md:px-6 md:py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300 border border-white/20 hover:border-white/40">
                  Contact Support
                </button>

              </Link>
          </div>


          <div className="container mx-auto px-6 pt-20 pb-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-400/30">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-300">Transparent Governance Platform</span>
                </div>

                <h1 className="text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Empowering Citizens
                  </span>
                  <br />
                  <span className="text-white">Through Technology</span>
                </h1>

                <p className="text-xl text-gray-300 leading-relaxed">
                  Report civic issues instantly. Track progress in real-time.
                  Experience transparent governance with automated complaint routing,
                  time-bound resolutions, and comprehensive insights for authorities.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Zap, text: "Auto Routing", color: "blue" },
                    { icon: Clock, text: "Time-Bound", color: "purple" },
                    { icon: BarChart3, text: "Live Analytics", color: "pink" },
                    { icon: Users, text: "User Friendly", color: "cyan" }
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-white/30 transition-all duration-300">
                      <div className={`w-10 h-10 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 rounded-lg flex items-center justify-center`}>
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105">
                    File a Complaint
                  </button>
                  <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-semibold transition-all duration-300 border border-white/20 hover:border-white/40">
                    Learn More
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Complaints", value: stats.complaints, icon: MapPin, color: "blue" },
                    { label: "Resolved", value: stats.resolved, icon: CheckCircle, color: "green" },
                    { label: "Departments", value: stats.departments, icon: Building2, color: "purple" }
                  ].map((stat, i) => (
                    <div key={i} className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                      <stat.icon className={`w-6 h-6 text-${stat.color}-400 mb-2`} />
                      <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    How It Works
                  </h3>

                  <div className="space-y-4">
                    {flows.map((flow, i) => {
                      const Icon = flow.icon;
                      const isActive = activeFlow === i;
                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${isActive
                            ? 'bg-gradient-to-r ' + flow.color + ' shadow-lg scale-105'
                            : 'bg-white/5'
                            }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-white/20' : 'bg-white/10'
                            }`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="font-semibold">{flow.text}</div>
                            <div className="text-sm text-gray-300">Step {i + 1}</div>
                          </div>
                          {isActive && (
                            <div className="ml-auto">
                              <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl border border-green-400/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-300">Resolution Rate</span>
                    <span className="text-2xl font-bold text-green-400">89.6%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: '89.6%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Departments Section */}
      <div className="relative py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Our Departments
              </span>
            </h2>
            <p className="text-xl text-gray-400">Connected boards working together for better governance</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, i) => {
              const Icon = dept.icon;
              const isActive = activeDept === i;
              return (
                <div
                  key={i}
                  className={`p-6 bg-white/5 backdrop-blur-sm rounded-2xl border transition-all duration-500 hover:scale-105 ${isActive ? 'border-' + dept.color + '-400 shadow-lg shadow-' + dept.color + '-500/30' : 'border-white/10'
                    }`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br from-${dept.color}-500 to-${dept.color}-600 rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{dept.name}</h3>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="text-2xl font-bold text-blue-400">{dept.count}</div>
                      <div className="text-sm text-gray-400">Total Cases</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">{dept.resolved}</div>
                      <div className="text-sm text-gray-400">Resolved</div>
                    </div>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r from-${dept.color}-400 to-${dept.color}-500 h-2 rounded-full`}
                      style={{ width: `${(parseInt(dept.resolved) / parseInt(dept.count)) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Success Stories Section */}
      <div className="relative py-20 bg-gradient-to-br from-slate-800 via-purple-900/30 to-slate-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Recent Success Stories
              </span>
            </h2>
            <p className="text-xl text-gray-400">Real problems solved, real impact made</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {solvedCases.map((item, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-green-400/50 transition-all duration-300 hover:scale-105"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-4xl">{item.before}</div>
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                    <div className="text-4xl">{item.after}</div>
                  </div>

                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{item.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400 font-semibold">{item.days}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-semibold">{item.rating}</span>
                    </div>
                  </div>

                  <div className="px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-xs text-purple-300">
                    {item.dept}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-green-500/50 hover:shadow-green-500/70">
              View All Success Stories
            </button>
          </div>
        </div>
      </div>

      {/* States Coverage Section */}
      <div className="relative py-20 bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Nationwide Coverage
              </span>
            </h2>
            <p className="text-xl text-gray-400">Serving citizens across India</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {states.map((state, i) => (
              <div
                key={i}
                className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-blue-400/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{state.name}</h3>
                    <div className="text-sm text-gray-400">{state.districts} Districts</div>
                  </div>
                  <MapPinned className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {state.complaints.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Active Complaints</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Platform Features
              </span>
            </h2>
            <p className="text-xl text-gray-400">Everything you need for efficient governance</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of citizens using Civic Eye to improve their communities.
            Your voice matters, and we're here to make sure it's heard.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-10 py-5 bg-white text-purple-900 hover:bg-gray-100 rounded-xl font-bold text-lg transition-all duration-300 shadow-2xl hover:scale-105">
              Get Started Now
            </button>
            <button className="px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl font-bold text-lg transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative py-12 bg-slate-950 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-8 h-8 text-blue-400" />
                <span className="text-xl font-bold">Civic Eye</span>
              </div>
              <p className="text-gray-400 text-sm">Empowering citizens through transparent and efficient governance.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-white cursor-pointer">About Us</li>
                <li className="hover:text-white cursor-pointer">Departments</li>
                <li className="hover:text-white cursor-pointer">Success Stories</li>
                <li className="hover:text-white cursor-pointer">FAQs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Citizens</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-white cursor-pointer">File Complaint</li>
                <li className="hover:text-white cursor-pointer">Track Status</li>
                <li className="hover:text-white cursor-pointer">User Guide</li>
                <li className="hover:text-white cursor-pointer">Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  support@civiceye.gov.in
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  1800-XXX-XXXX
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Hero;

