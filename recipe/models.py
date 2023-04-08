from django.db import models

from core.models import Home, User
from inventory.models import Item, UnitOfMeasure, UnitOfMeasureConversion


class RecipeCategory(models.Model):
    """
    Stores the Recipe Categories used within the Inventory Module
    """

    name = models.CharField(max_length=200)
    description = models.TextField(max_length=2000, blank=True)

    parent_category = models.ForeignKey(
        to="self",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="children"
    )

    home = models.ForeignKey(
        to=Home,
        on_delete=models.PROTECT,
        related_name="recipe_categories"
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Recipe Category"
        verbose_name_plural = "Recipe Categories"
        ordering = ["name"]


class RecipeTag(models.Model):
    """
    Stores the Recipe Tags used within the Inventory Module
    """

    name = models.CharField(max_length=200)
    description = models.TextField(max_length=2000, blank=True)

    home = models.ForeignKey(
        to=Home,
        on_delete=models.PROTECT,
        related_name="recipe_tags"
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Recipe Tag"
        verbose_name_plural = "Recipe Tags"
        ordering = ["name"]


class Recipe(models.Model):
    """
    Stores Recipes used within the Inventory Module.
    """

    name = models.CharField(max_length=200)
    category = models.ForeignKey(to=RecipeCategory, on_delete=models.PROTECT, null=True, blank=True, related_name="recipes")
    description = models.TextField(max_length=2000, blank=True)
    cover_image = models.ImageField(upload_to="recipe_covers", blank=True)
    favorite = models.BooleanField(default=False)
    tags = models.ManyToManyField(to=RecipeTag, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(to=User, on_delete=models.PROTECT, related_name="created_recipes")
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(to=User, on_delete=models.PROTECT, related_name="updated_recipes")

    home = models.ForeignKey(
        to=Home,
        on_delete=models.PROTECT,
        related_name="recipes"
    )

    def __str__(self):
        return f"{self.name} ({self.category})"

    class Meta:
        verbose_name = "Recipe"
        verbose_name_plural = "Recipes"
        ordering = ["name"]


class RecipeIngredient(models.Model):
    """
    Stores the Ingredients used within a given Recipe.
    """

    recipe = models.ForeignKey(to=Recipe, related_name="ingredients", on_delete=models.PROTECT)
    item = models.ForeignKey(to=Item, related_name="recipe_ingredients", on_delete=models.PROTECT)
    quantity = models.FloatField("Quantity", default=1)
    unit = models.ForeignKey(to=UnitOfMeasure, related_name="recipe_ingredients", on_delete=models.PROTECT)

    def __str__(self):
        return f"{self.quantity} {self.unit} of {self.item}"

    class Meta:
        verbose_name = "Recipe Ingredient"
        verbose_name_plural = "Recipe Ingredients"


class RecipeStep(models.Model):
    """
    Stores the Steps used within a given Recipe.
    """

    recipe = models.ForeignKey(to=Recipe, on_delete=models.PROTECT)
    step_number = models.IntegerField("Step Number")
    description = models.TextField("Description", max_length=2000)

    def __str__(self):
        return f"{self.recipe.name} - Step {self.step_number}: {self.description}"

    class Meta:
        verbose_name = "Recipe Step"
        verbose_name_plural = "Recipe Steps"
        ordering = ["recipe", "step_number"]


