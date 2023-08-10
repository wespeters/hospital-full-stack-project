#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
import datetime
from datetime import time as time_obj

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import Doctor, Patient, Appointment, Login, db

fake = Faker()

def create_doctors(num):
    doctors = []
    for _ in range(num):
        doctor = Doctor(lastname=fake.last_name())
        doctors.append(doctor)
    return doctors

def create_patients(num):
    patients = []
    for _ in range(num):
        dob = fake.date_of_birth(minimum_age=20, maximum_age=90).strftime('%m/%d/%Y')
        patient = Patient(firstname=fake.first_name(), lastname=fake.last_name(), dob=dob)
        patients.append(patient)
    return patients

def create_appointments(doctors, patients):
    appointments = []
    for doctor in doctors:
        for _ in range(randint(1, 10)):  # Each doctor will have between 1 to 10 appointments.
            patient = rc(patients)
            date = fake.date_between(start_date='-1y', end_date='+1y').strftime('%m/%d/%Y')
            hour = randint(9, 16) # 9 AM to 4 PM
            minute = randint(0, 59)
            hour_str = f'{hour:02}'
            minute_str = f'{minute:02}'
            time = f'{hour_str}:{minute_str}'


            appointment = Appointment(date=date, time=time, doctor_id=doctor.id, patient_id=patient.id)
            appointments.append(appointment)
    return appointments

def create_logins(doctors):
    logins = []
    for doctor in doctors:
        login = Login(username=f"{doctor.lastname}{doctor.id}", password=fake.password(), user_type="Doctor", user=f"Dr. {doctor.lastname}")
        logins.append(login)
    
    # Creating some admin logins
    for _ in range(5):  # 5 admin accounts
        login = Login(username=fake.user_name(), password=fake.password(), user_type="Admin", user="Admin")
        logins.append(login)
    
    return logins

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed...")

        db.session.rollback()  # In case a previous session was interrupted

        # Remove all existing data
        Doctor.query.delete()
        Patient.query.delete()
        Appointment.query.delete()
        Login.query.delete()

        # Create fake data for doctors and patients
        doctors = create_doctors(10)
        patients = create_patients(50)

        # Add and commit doctors and patients to the session
        db.session.add_all(doctors)
        db.session.add_all(patients)
        db.session.commit()  # Commit here to assign IDs

        # Create fake data for appointments and logins using the committed doctors and patients
        appointments = create_appointments(doctors, patients)
        logins = create_logins(doctors)

        # Add and commit appointments and logins to the session
        db.session.add_all(appointments)
        db.session.add_all(logins)

        # Commit the session to store data in the database
        db.session.commit()

        print("Seeding completed successfully!")

