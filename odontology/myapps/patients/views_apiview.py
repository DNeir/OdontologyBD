from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Appointment, DentalHistory, Patient
from .serializers import (
    AppointmentSerializer,
    DentalHistorySerializer,
    PatientSerializer,
)


# ---------------------------------------------
# Patient
# ---------------------------------------------
class PatientListCreateAPIView(APIView):
    def get(self, request):
        patients = Patient.objects.all()
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PatientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PatientRetrieveUpdateDestroyAPIView(APIView):
    def get_object(self, pk):
        try:
            return Patient.objects.get(pk=pk)
        except Patient.DoesNotExist:
            return None

    def get(self, request, pk):
        patient = self.get_object(pk)
        if not patient:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = PatientSerializer(patient)
        return Response(serializer.data)

    def put(self, request, pk):
        patient = self.get_object(pk)
        if not patient:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = PatientSerializer(patient, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        patient = self.get_object(pk)
        if not patient:
            return Response(status=status.HTTP_404_NOT_FOUND)
        patient.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ---------------------------------------------
# DentalHistory
# ---------------------------------------------
class DentalHistoryListCreateAPIView(APIView):
    def get(self, request):
        histories = DentalHistory.objects.all()
        serializer = DentalHistorySerializer(histories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = DentalHistorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DentalHistoryRetrieveUpdateDestroyAPIView(APIView):
    def get_object(self, pk):
        try:
            return DentalHistory.objects.get(pk=pk)
        except DentalHistory.DoesNotExist:
            return None

    def get(self, request, pk):
        history = self.get_object(pk)
        if not history:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = DentalHistorySerializer(history)
        return Response(serializer.data)

    def put(self, request, pk):
        history = self.get_object(pk)
        if not history:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = DentalHistorySerializer(history, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        history = self.get_object(pk)
        if not history:
            return Response(status=status.HTTP_404_NOT_FOUND)
        history.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ---------------------------------------------
# Appointment
# ---------------------------------------------
class AppointmentListCreateAPIView(APIView):
    def get(self, request):
        appointments = Appointment.objects.all()
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AppointmentRetrieveUpdateDestroyAPIView(APIView):
    def get_object(self, pk):
        try:
            return Appointment.objects.get(pk=pk)
        except Appointment.DoesNotExist:
            return None

    def get(self, request, pk):
        appointment = self.get_object(pk)
        if not appointment:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data)

    def put(self, request, pk):
        appointment = self.get_object(pk)
        if not appointment:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = AppointmentSerializer(appointment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        appointment = self.get_object(pk)
        if not appointment:
            return Response(status=status.HTTP_404_NOT_FOUND)
        appointment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
