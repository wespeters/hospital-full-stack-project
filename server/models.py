from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from datetime import datetime

from config import db

# Models go here!
class Doctor(db.Model, SerializerMixin):
    __tablename__ = 'doctors'

    id = db.Column(db.Integer, primary_key = True)
    lastname = db.Column(db.String)

    appointments = db.relationship('Appointment', cascade = 'all, delete', backref = 'doctor')

    serialize_rules = ('-appointments.doctor',)

    def __repr__(self):
        return f'<Doctor {self.lastname}>'

class Patient(db.Model, SerializerMixin):
    __tablename__ = 'patients'

    id = db.Column(db.Integer, primary_key = True)
    firstname = db.Column(db.String)
    lastname = db.Column(db.String)
    dob = db.Column(db.String)

    appointments = db.relationship('Appointment', cascade = 'all, delete', backref = 'patient')

    @validates('dob')
    def validates_dob(self, key, dob):
        if bool(datetime.strptime(dob, '%m/%d/%Y')):
            pass
        else:
            raise ValueError('DOB must use correct format \'mm/dd/yyyy\'')
        return dob

    serialize_rules = ('-appointments.patient',)

    def __repr__(self):
        return f'<Patient {self.firstname} {self.lastname}>'
    
class Appointment(db.Model, SerializerMixin):
    __tablename__ = 'appointments'

    id = db.Column(db.Integer, primary_key = True)
    date = db.Column(db.String)
    time = db.Column(db.String)

    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'))
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'))

    serialize_rules = ('-doctor.appointments', '-patient.appointments')

    @validates('date', 'time')
    def validates_appointment(self, key, value):
        if key == 'date':
            if bool(datetime.strptime(value, '%m/%d/%Y')) == False:
                raise ValueError('DOB must use correct format \'mm/dd/yyyy\'')
        elif key == 'time':
            if len(value) != 5:
                raise ValueError('Time must be 5 characters long.')
            elif value[2] != ':':
                raise ValueError('Time must use the format \'hh:mm\'')
            else:
                for char in value:
                    if char != value[2]:
                        if bool(char.isdigit()) == False:
                            raise ValueError('Time must use the format \'hh:mm\'.')
                        
            if int(value[0]) > 2 or (int(value[0]) == 2 and int(value[1]) > 3):
                raise ValueError('Hour must not be greater than 23.')
            elif int(value[3]) > 5:
                raise ValueError('Minute must not be greater than 59.')

        return value

    def __repr__(self):
        return f'<Appointment Doctor ID: {self.doctor_id}, Patient ID: {self.patient_id}>'
    
class Login(db.Model, SerializerMixin):
    __tablename__ = 'logins'

    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String)
    password = db.Column(db.String)
    user_type = (db.Column(db.String))
    user = db.Column(db.String)

    @validates('user_type')
    def validates_type_user(self, key, user_type):
        if user_type.title() not in ['Admin','Doctor']:
            raise ValueError('User Type must be either \'Admin\' or \'Doctor\'')
        return user_type

    def __repr__(self):
        return f'<Login {self.username}: {self.password}>'
