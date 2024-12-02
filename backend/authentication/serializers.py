from django.utils.timezone import make_aware, get_current_timezone
from django.contrib.auth import authenticate
import datetime
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import *

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom serializer for obtaining JWT tokens.

    Attributes:
        username_field (str): The field used for authentication (email).
    """
    username_field = 'email'

    @classmethod
    def get_token(cls, user):
        """
        Customize the token to include additional user information.

        Args:
            user (User): The user for whom the token is generated.

        Returns:
            token (Token): The customized JWT token.
        """
        token = super().get_token(user)

        token['email'] = user.email
        token['user_role'] = user.user_role
        
        token['is_active'] = user.is_active
        token['is_staff'] = user.is_staff

        token['full_name'] = f"{user.first_name} {user.last_name}"
        
        

        return token

    def validate(self, attrs):
        """
        Validate user credentials and authenticate the user.
        """
        try:
            email = attrs.get('email')
            password = attrs.get('password')

            if not email or not password:
                raise serializers.ValidationError(
                    {'error': 'Both email and password are required.'}, 
                    code='authorization'
                )

            # Try to get the user first
            try:
                user = User.objects.get(email=email)
                if not user.is_active:
                    raise serializers.ValidationError(
                        {'error': 'Please activate your account via email first.'}, 
                        code='authorization'
                    )
            except User.DoesNotExist:
                raise serializers.ValidationError(
                    {'error': 'No account found with this email.'}, 
                    code='authorization'
                )

            # Try to authenticate
            user = authenticate(
                request=self.context.get('request'),
                email=email, 
                password=password
            )

            if not user:
                raise serializers.ValidationError(
                    {'error': 'Invalid password.'}, 
                    code='authorization'
                )

            attrs['user'] = user
            return super().validate(attrs)
            
        except Exception as e:
            raise serializers.ValidationError(
                {'error': str(e)}, 
                code='authorization'
            )


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    def get_name(self, obj):
        if obj.user_role == UserRoleChoices.health_professional:
            return f"Dr. {obj.first_name} {obj.last_name}"
        return f"{obj.first_name} {obj.last_name}"

    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'phone', 'user_role']


class PastMetricsSerializer(serializers.ModelSerializer):
    bmi = serializers.ReadOnlyField()

    class Meta:
        model = PastMetrics
        fields = ['id', 'bmi', 'height', 'weight', 'blood_glucose', 'blood_pressure', 'created_at', 'updated_field']

class DoctorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = DoctorProfile
        fields = ['id', 'user', 'specialization', 'available']

def calculate_age(dob):
    # Ensure dob is a datetime object, if not, parse it from a string
    if isinstance(dob, str):
        dob = datetime.strptime(dob, "%Y-%m-%d")
    
    today = datetime.today()
    age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
    
    return age

class PatientProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    age = serializers.SerializerMethodField()
    bmi = serializers.ReadOnlyField()

    def get_age(self, obj):
        return calculate_age(obj.user.dob)

    class Meta:
        model = PatientProfile
        fields = ['id', 'user', 'age', 'weight', 'height', 'bmi', 'blood_glucose', 'blood_pressure', 'allergies']
        read_only_fields = ['age']

    def update(self, instance, validated_data):
        """
        Update and return an existing `PatientProfile` instance, given the validated data.
        """
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
