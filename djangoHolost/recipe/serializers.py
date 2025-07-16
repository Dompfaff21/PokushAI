from rest_framework import serializers

from .models import Posts, Steps


class RecipeCreateStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Steps
        fields = ['step_des', 'step_image']
        extra_kwargs = {
            'step_image': {'required': False}
        }

    def validate_steps(self, value):
        if len(value) < 1:
            raise serializers.ValidationError("Должен быть хотя бы один шаг")
        return value


class RecipePostCreateSerializer(serializers.ModelSerializer):
    steps = RecipeCreateStepSerializer(many=True, required=False)
    is_updated = serializers.ReadOnlyField()

    class Meta:
        model = Posts
        fields = [
            'title', 'description', 'post_image',
            'steps', 'is_updated', 'created_at'
        ]
        extra_kwargs = {
            'post_image': {'required': False},
            'created_at': {'read_only': True}
        }

    def create(self, validated_data):
        steps_data = validated_data.pop('steps', [])
        post = Posts.objects.create(
            **validated_data,
            author=self.context['request'].user
        )

        for step_data in steps_data:
            Steps.objects.create(recipe=post, **step_data)

        return post


class RecipePostUpdateSerializer(RecipePostCreateSerializer):
    def update(self, instance, validated_data):
        steps_data = validated_data.pop('steps', None)

        instance = super().update(instance, validated_data)

        if steps_data is not None:
            instance.steps.all().delete()
            for step_data in steps_data:
                Steps.objects.create(recipe=instance, **step_data)

        return instance