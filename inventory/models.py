"""
Inventory Data Models:
- CategoryType
- Category
    - Category Manager
    - Item Category Manager
    - Parent Category Manager
- Unit of Measure
- Unit of Measure Conversion
- Item
- Item Unit of Measure
- Supplier
- Supplier Item
- Supplier Location
"""

from django.db import models

from core.models import Home


class CategoryManager(models.Manager):
    """
    Manager for the Category Model
     - Get Hierarchy - Returns a Full Hierarchy of the categories.
     - Get Choices - Returns a hierarchy of choices for a Select2 control.
    """
    def get_hierarchy(self, home_id: int):
        """
        Provides the hierarchy of Categories based on recursive parent/child relationships.
        """
        category_tree = [{
            "level": x.level,
            "id": x.id,
            "name": x.name,
            "description": x.description,
            "children": [],
            "item_count": len([y for y in x.child_items]),
            "extended_item_count": len(x.recursive_child_items)
            } for x in Category.objects.filter(
                home=home_id,
                parent_category__isnull=True)]

        for cat in category_tree:
            cat["children"] = [{
                "level": x.level,
                "id": x.id,
                "name": x.name,
                "description": x.description,
                "children": [],
                "item_count": len(x.child_items),
                "extended_item_count": len(x.recursive_child_items)
                } for x in Category.objects.filter(home=home_id,parent_category_id=cat.get("id"))]

            if cat["children"]:
                traversing = True
                current_cat = cat

                while traversing:
                    for current in current_cat["children"]:
                        current["children"] = [
                            {
                                "level": x.level,
                                "id": x.id,
                                "name": x.name,
                                "description": x.description,
                                "children": [],
                                "item_count": len(x.child_items),
                                "extended_item_count": len(x.recursive_child_items)
                            } for x in Category.objects.filter(home=home_id,
                                parent_category_id=current.get("id"))
                            ]

                        if current["children"]:
                            current_cat = current
                        else:
                            traversing = False

        return category_tree

    def get_choices(self):
        """
        Provides Category Choices available, formatted for a Select2 Dropdown-List
        """

        categories = Category.objects.all()
        levels = max([x.level for x in Category.objects.filter(parent_category_id__isnull=False)])

        tree = {}

        for i in range(0, levels+1):
            tree[i] = []


        for cat in categories:
            entry = []
            if cat.parent_category:
                entry.append(cat.parent_category_id)

            if cat.child_categories:
                entry.append(cat.id)
                entry.append(cat.name)
                entry.append([])
            else:
                entry.append(cat.id)
                entry.append(cat.name)

            tree[cat.level].append(entry)

        for i in range(levels, 0, -1):
            for cat in tree[i]:
                for parent in tree[i-1]:
                    if i > 1:
                        if parent[1] == cat[0]:
                            cat.pop(0)
                            if len(cat) > 2:
                                if isinstance(cat[2], str):
                                    cat.pop(0)
                            parent[3].append(cat)
                    else:
                        if parent[0] == cat[0]:
                            cat.pop(0)
                            if len(cat) > 2:
                                if not isinstance(cat[2], str):
                                    cat.pop(0)
                            parent[2].append(cat)

        for root_cat in tree[0]:
            if len(root_cat) > 2:
                root_cat.pop(0)
        return tree[0]


class ItemCategoryManager(models.Manager):
    """
    Manager for returning a queryset of categories that *do not* contain sub-categories.
    Categories with sub-categories cannot contain items.
    """

    def get_queryset(self):
        """
        Provides the Queryset
        """

        childless_categories = [x.id for x in Category.objects.all() if len(x.child_categories) == 0]

        return super().get_queryset().filter(id__in=childless_categories)


class ParentCategoryManager(models.Manager):
    """
    Manager for returning a queryset of categoires that *do not* contain child items.
    Categories with items cannot contain sub-categories.
    """

    def get_queryset(self):
        """
        Provides the Queryset
        """

        itemless_categories = [x.id for x in Category.objects.all() if len(x.child_items) == 0]

        return super().get_queryset().filter(id__in=itemless_categories)


class Category(models.Model):
    """
    Stores Categories used within the Inventory Module
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
        related_name="categories"
    )

    @property
    def child_items(self):
        """
        Provides a list of child items assigned to the category.
        """

        return [x for x in Item.objects.filter(category_id=self.pk)]

    @property
    def recursive_child_items(self):
        """
        Provides a list of *all* child items assigned to the category,
        including items assigned to the category's sub-categories.
        """

        if self.child_items:
            return self.child_items

        items = []
        for cat in self.child_categories:
            items.extend(cat.recursive_child_items)

        return items

    @property
    def child_categories(self):
        """
        Provides the sub-categories belonging to a category.
        """

        return Category.objects.filter(parent_category_id=self.pk)

    @property
    def level(self):
        """
        Provies the level in the heirarchy at which the category resides.
        """

        level = 0
        cat = self
        while cat.parent_category:
            level += 1
            cat = cat.parent_category

        return level

    objects = CategoryManager()
    item_categories = ItemCategoryManager()
    parent_categories = ParentCategoryManager()


    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["name"]


class UnitOfMeasure(models.Model):
    """
    Stores the Units of Measure available within the Inventory Module
    """

    name = models.CharField("Name", max_length=200, unique=True)
    abbreviation = models.CharField("Abbreviation", max_length=10, blank=True)
    description = models.TextField("Description", max_length=2000, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Unit of Measure"
        verbose_name_plural = "Units of Measure"


class UnitOfMeasureConversion(models.Model):
    """
    Stores the Conversion Rates used by Units of Measure within
    the Inventory Module.
    """

    name = models.CharField("Name", max_length=200)
    description = models.TextField("Description", max_length=2000, blank=True)
    conversion = models.FloatField("Conversion Rate", default=1)

    from_unit = models.ForeignKey(
        to=UnitOfMeasure,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="from_unit"
    )

    to_unit = models.ForeignKey(
        to=UnitOfMeasure,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="to_unit"
    )

    def __str__(self):
        return "One {fr} = {conv} {to}".format(
            conv=self.conversion,
            fr=self.from_unit,
            to=self.to_unit)
    
    class Meta:
        verbose_name = "Unit of Measure Conversion"


class Item(models.Model):
    """
    Stores Items available for use within the Inventory Module.
    """

    name = models.CharField(max_length=200, unique=True)
    description = models.TextField(max_length=2000, blank=True)

    category = models.ForeignKey(
        to=Category,
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )

    home = models.ForeignKey(
        to=Home,
        on_delete=models.PROTECT
    )

    @property
    def units_of_measure(self):
        """
        Provides the Units of Measure defined specifically for a given item.
        """

        return ItemUnitOfMeasure.objects.filter(item_id=self.id)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["category__name", "name"]


class ItemUnitOfMeasure(models.Model):
    """
    Stores the Units of Measure defined specifically for individual items.
    """

    item_unit = models.CharField("Item Unit", blank=True, max_length=200)
    item = models.ForeignKey(to=Item, on_delete=models.PROTECT)
    unit = models.ForeignKey(to=UnitOfMeasure, on_delete=models.PROTECT)
    conversion = models.FloatField("Conversion Rate", default=1.0)

    def __str__(self):
        return "1 {iu} of {i} = {c} {u}".format(
            iu=(self.item_unit or self.unit),
            i=self.item,
            c=self.conversion,
            u=self.unit)

    class Meta:
        verbose_name = "Item Unit of Measure"
        verbose_name_plural = "Item Units of Measure"


class Supplier(models.Model):
    """
    Stores Suppliers available for use within the Inventory Module
    """

    name = models.CharField("Name", max_length=200)
    website = models.URLField("Website", max_length=400, blank=True)

    category = models.ForeignKey(
        to=Category,
        on_delete=models.PROTECT
    )

    home = models.ForeignKey(
        to=Home,
        on_delete=models.PROTECT
    )

    def __str__(self):
        return self.name.title()


class SupplierLocation(models.Model):
    """
    Stores the Location(s) where Suppliers do Business.
    """

    name = models.CharField("Name", max_length=200)
    street_address1 = models.CharField("Street Address 1", max_length=200, blank=True)
    street_address2 = models.CharField("Street Address 2", max_length=200, blank=True)
    city = models.CharField("City", max_length=200, blank=True)
    state = models.CharField("State", max_length=200, blank=True)
    phone_number = models.CharField("Phone", max_length=200, blank=True)

    supplier = models.ForeignKey(to=Supplier, on_delete=models.PROTECT)

    def __str__(self):
        return self.name.title()

    class Meta:
        verbose_name = "Supplier Location"
        verbose_name_plural = "Supplier Locations"


class SupplierItem(models.Model):
    """
    Stores the Items provided by Suppliers.
    Must be linked to a valid Inventory Item.
    A Supplier can provide various forms of an individual inventory item.
    """

    name = models.CharField("Name", max_length=200)
    description = models.TextField("Description", max_length=1000, blank=True)
    brand = models.CharField("Brand", max_length=200, blank=True)

    supplier = models.ForeignKey(Supplier, on_delete=models.PROTECT)
    inventory_item = models.ForeignKey(Item, on_delete=models.PROTECT)

    def __str__(self):
        return self.name.title()

    class Meta:
        verbose_name = "Supplier Item"
        verbose_name_plural = "Supplier Items"