from flask import Flask, request, make_response, jsonify
from flask_restful import Api, Resource
from models import db, Doctor, Patient, Appointment, Login
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get(
    "DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

migrate = Migrate(app, db)

api = Api(app)

db.init_app(app)

@app.route('/')
def index():
    return '<h1>Phase 4 Project Server</h1>'

class Doctors(Resource):
    def get(self, id=None):
        if id:
            doctor = Doctor.query.filter_by(id=id).one_or_none()
            if doctor is None:
                return make_response(jsonify({'error': 'Doctor not found'}), 404)
            else:
                return make_response(jsonify(doctor.to_dict()), 200)
        else:
            doctors = Doctor.query.all()
            return make_response(jsonify([doctor.to_dict() for doctor in doctors]), 200)

    def post(self):
        new_doctor = Doctor(**request.json)
        db.session.add(new_doctor)
        db.session.commit()
        return make_response(jsonify(new_doctor.to_dict()), 201)

    def patch(self, id):
        doctor = Doctor.query.filter_by(id=id).one_or_none()
        if doctor is None:
            return make_response(jsonify({'error': 'Doctor not found'}), 404)
        else:
            for key, value in request.json.items():
                setattr(doctor, key, value)
            db.session.commit()
            return make_response(jsonify(doctor.to_dict()), 200)

    def delete(self, id):
        doctor = Doctor.query.filter_by(id=id).one_or_none()
        if doctor is None:
            return make_response(jsonify({'error': 'Doctor not found'}), 404)
        else:
            db.session.delete(doctor)
            db.session.commit()
            return make_response(jsonify({'result': 'Doctor deleted'}), 200)


class Patients(Resource):
    def get(self, id=None):
        if id:
            patient = Patient.query.filter_by(id=id).one_or_none()
            if patient is None:
                return make_response(jsonify({'error': 'Patient not found'}), 404)
            else:
                return make_response(jsonify(patient.to_dict()), 200)
        else:
            patients = Patient.query.all()
            return make_response(jsonify([patient.to_dict() for patient in patients]), 200)

    def post(self):
        new_patient = Patient(**request.json)
        db.session.add(new_patient)
        db.session.commit()
        return make_response(jsonify(new_patient.to_dict()), 201)

    def patch(self, id):
        patient = Patient.query.filter_by(id=id).one_or_none()
        if patient is None:
            return make_response(jsonify({'error': 'Patient not found'}), 404)
        else:
            for key, value in request.json.items():
                setattr(patient, key, value)
            db.session.commit()
            return make_response(jsonify(patient.to_dict()), 200)

    def delete(self, id):
        patient = Patient.query.filter_by(id=id).one_or_none()
        if patient is None:
            return make_response(jsonify({'error': 'Patient not found'}), 404)
        else:
            db.session.delete(patient)
            db.session.commit()
            return make_response(jsonify({'result': 'Patient deleted'}), 200)


class Appointments(Resource):
    def get(self, id=None):
        if id:
            appointment = Appointment.query.filter_by(id=id).one_or_none()
            if appointment is None:
                return make_response(jsonify({'error': 'Appointment not found'}), 404)
            else:
                return make_response(jsonify(appointment.to_dict()), 200)
        else:
            appointments = Appointment.query.all()
            return make_response(jsonify([appointment.to_dict() for appointment in appointments]), 200)

    def post(self):
        new_appointment = Appointment(**request.json)
        db.session.add(new_appointment)
        db.session.commit()
        return make_response(jsonify(new_appointment.to_dict()), 201)

    def patch(self, id):
        appointment = Appointment.query.filter_by(id=id).one_or_none()
        if appointment is None:
            return make_response(jsonify({'error': 'Appointment not found'}), 404)
        else:
            for key, value in request.json.items():
                setattr(appointment, key, value)
            db.session.commit()
            return make_response(jsonify(appointment.to_dict()), 200)

    def delete(self, id):
        appointment = Appointment.query.filter_by(id=id).one_or_none()
        if appointment is None:
            return make_response(jsonify({'error': 'Appointment not found'}), 404)
        else:
            db.session.delete(appointment)
            db.session.commit()
            return make_response(jsonify({'result': 'Appointment deleted'}), 200)


class Logins(Resource):
    def get(self, id = None):
        if id:
            login = Login.query.filter_by(id = id).first().to_dict()
            return make_response(login, 200)
        else:
            logins = [login.to_dict() for login in Login.query.all()]
            return make_response(logins, 200)

    def post(self):
        new_login = Login(**request.json)
        db.session.add(new_login)
        db.session.commit()
        return make_response(new_login.to_dict(), 201)

    def delete(self, id):
        login = Login.query.filter_by(id = id).first()
        db.session.delete(login)
        db.session.commit()
        return make_response({'message': 'Login successfully deleted'}, 200)
    
    def patch(self, id):
        login = Login.query.filter_by(id = id).first()

        if login:
            for key, value in request.json.items():
                setattr(login, key, value)
            
            db.session.add(login)
            db.session.commit()
            
            return make_response({"message": "Login Successfully Updated!"}, 200)
        else:
            return make_response({"message": "Error, Login was not found"}, 404)

class PatientLogins(Resource):
    def post(self):
        firstname = request.json.get('firstname')
        lastname = request.json.get('lastname')
        dob = request.json.get('dob')

        patient = Patient.query.filter_by(firstname=firstname, lastname=lastname, dob=dob).one_or_none()

        if patient is None:
            return make_response(jsonify({'error': 'Invalid login credentials'}), 401)
        else:
            return make_response(jsonify({'success': 'Login successful'}), 200)

api.add_resource(Doctors, '/doctors', '/doctors/<int:id>')
api.add_resource(Patients, '/patients', '/patients/<int:id>')
api.add_resource(Appointments, '/appointments', '/appointments/<int:id>')
api.add_resource(Logins, '/logins', '/logins/<int:id>')
api.add_resource(PatientLogins, '/patientlogin')


if __name__ == '__main__':
    app.run(debug=True)
