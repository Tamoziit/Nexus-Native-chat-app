import * as ImageManipulator from "expo-image-manipulator";

const resizeImage = async (file: string) => {
    const manipulated = await ImageManipulator.manipulateAsync(
        file,
        [],
        {
            compress: 0.8,
            format: ImageManipulator.SaveFormat.JPEG,
        }
    );

    return manipulated.uri;
}

export default resizeImage;